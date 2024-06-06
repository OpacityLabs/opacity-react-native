mod notary;

use http_body_util::Full;
use hyper::{body::Bytes, Request as HRequest, StatusCode as HStatusCode};
use hyper_util::rt::TokioIo;
use serde::{Deserialize, Serialize};
use std::ops::Range;
use tlsn_core::proof::TlsProof;
use tokio::io::DuplexStream;
use tokio_util::compat::{FuturesAsyncReadCompatExt, TokioAsyncReadCompatExt};

use lazy_static::lazy_static;

use std::ffi::{c_char, CStr, CString};

use std::sync::Arc;
use tlsn_prover::tls::{state::Notarize, Prover, ProverConfig};
use tokio::runtime::{Builder, Runtime};

lazy_static! {
    pub static ref RUNTIME: Arc<Runtime> = Arc::new(
        Builder::new_multi_thread()
            .worker_threads(3)
            .max_blocking_threads(2)
            .enable_all()
            .build()
            .unwrap()
    );
}

// Setting of the application server

#[derive(Serialize)]
pub struct Error {
    pub message: &'static str,
    pub code: &'static str,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct Request {
    host: String,
    path: String,
    headers: Vec<(String, String)>,
    body: String,
    redact_strings: Vec<String>,
    max_sent: usize,
    max_recv: usize,
}

#[no_mangle]
unsafe extern "C" fn start(request: *const c_char) -> *const c_char {
    let c_str = unsafe { CStr::from_ptr(request) };
    let str_slice = c_str.to_str().unwrap();

    let request: Request = serde_json::from_str(str_slice).unwrap();
    let runtime = Builder::new_multi_thread()
        .worker_threads(3)
        .enable_all()
        .build()
        .unwrap();

    let (prover_socket, notary_socket) = tokio::io::duplex(1 << 16);

    let notary_handle = runtime.spawn(async move {
        notary::run_notary(notary_socket.compat(), request.max_sent, request.max_recv).await;
    });

    let handle = runtime.spawn(async move {
        let result = run(request, prover_socket).await;
        CString::new(result).unwrap()
    });

    let result = runtime.block_on(handle).unwrap();

    if (notary_handle.is_finished()) {
        println!("Notary finished");
    }

    println!("Thread finished");

    result.into_raw()
}

ffi_support::define_string_destructor!(signer_destroy_string);

async fn run(request: Request, prover_socket: DuplexStream) -> String {
    let proof = notarize(&request, prover_socket).await;

    let json_proof = serde_json::to_string_pretty(&proof).unwrap();

    json_proof
}

async fn notarize(request: &Request, prover_socket: DuplexStream) -> TlsProof {
    // let (prover_socket, session_id) =
    //     request_notarization("notary.pse.dev", 443, Some(16384)).await;

    // A Prover configuration
    let config = ProverConfig::builder()
        .id("example")
        .max_sent_data(request.max_sent)
        .max_recv_data(request.max_recv)
        .server_dns(request.to_owned().host)
        .build()
        .unwrap();
    // Create a Prover and set it up with the Notary
    // This will set up the MPC backend prior to connecting to the server.
    let prover = Prover::new(config)
        .setup(prover_socket.compat())
        .await
        .unwrap();

    // Connect to the Server via TCP. This is the TLS client socket.
    let client_socket = tokio::net::TcpStream::connect((request.to_owned().host, 443))
        .await
        .unwrap();

    // Bind the Prover to the server connection.
    // The returned `mpc_tls_connection` is an MPC TLS connection to the Server: all data written
    // to/read from it will be encrypted/decrypted using MPC with the Notary.
    let (mpc_tls_connection, prover_fut) = prover.connect(client_socket.compat()).await.unwrap();
    let mpc_tls_connection = TokioIo::new(mpc_tls_connection.compat());

    // Spawn the Prover task to be run concurrently
    let prover_task = tokio::spawn(prover_fut);

    // Attach the hyper HTTP client to the MPC TLS connection
    let (mut request_sender, connection) =
        hyper::client::conn::http1::handshake(mpc_tls_connection)
            .await
            .unwrap();

    // Spawn the HTTP task to be run concurrently
    tokio::spawn(connection);

    // Build a simple HTTP request with common headers
    let mut builder = HRequest::builder().uri(request.to_owned().path);

    for (header_name, header_value) in request.headers.clone() {
        builder = builder.header(header_name, header_value);
    }

    let notarization_request = if !request.body.is_empty() {
        // info!("empty body");
        builder
            .method("POST")
            .body(http_body_util::Full::from(hyper::body::Bytes::from(
                request.clone().body,
            )))
            .unwrap()
    } else {
        builder.body(Full::new(Bytes::default())).unwrap()
    };

    println!("Starting an MPC TLS connection with the server");

    // Send the request to the Server and get a response via the MPC TLS connection
    let response = request_sender
        .send_request(notarization_request)
        .await
        .unwrap();

    println!("Got a response from the server");

    assert!(response.status() == HStatusCode::OK);

    // The Prover task should be done now, so we can grab the Prover.
    let prover = prover_task.await.unwrap().unwrap();

    // Prepare for notarization.
    let prover = prover.start_notarize();

    // Build proof (with or without redactions)
    let proof = build_proof_with_redactions(prover, request.to_owned().redact_strings).await;

    println!("Notarization completed successfully!");
    proof
}

/// Find the ranges of the public and private parts of a sequence.
///
/// Returns a tuple of `(public, private)` ranges.
fn find_ranges(seq: &[u8], private_seq: &[&[u8]]) -> (Vec<Range<usize>>, Vec<Range<usize>>) {
    let mut private_ranges = Vec::new();
    for s in private_seq {
        for (idx, w) in seq.windows(s.len()).enumerate() {
            if w == *s {
                private_ranges.push(idx..(idx + w.len()));
            }
        }
    }

    let mut sorted_ranges = private_ranges.clone();
    sorted_ranges.sort_by_key(|r| r.start);

    let mut public_ranges = Vec::new();
    let mut last_end = 0;
    for r in sorted_ranges {
        if r.start > last_end {
            public_ranges.push(last_end..r.start);
        }
        last_end = r.end;
    }

    if last_end < seq.len() {
        public_ranges.push(last_end..seq.len());
    }

    (public_ranges, private_ranges)
}

async fn build_proof_with_redactions(
    mut prover: Prover<Notarize>,
    redact_strings: Vec<String>,
) -> TlsProof {
    // Identify the ranges in the outbound data which contain data which we want to disclose

    let mut redact_strings_vec: Vec<Vec<u8>> = Vec::new();

    redact_strings.iter().for_each(|redacted| {
        redact_strings_vec.push(redacted.as_bytes().to_vec());
    });

    let (sent_public_ranges, _) = find_ranges(
        prover.sent_transcript().data(),
        redact_strings_vec
            .iter()
            .map(|r| r.as_slice())
            .collect::<Vec<_>>()
            .as_slice(),
    );

    // Identify the ranges in the inbound data which contain data which we want to disclose
    let (recv_public_ranges, _) = find_ranges(
        prover.recv_transcript().data(),
        redact_strings_vec
            .iter()
            .map(|r| r.as_slice())
            .collect::<Vec<_>>()
            .as_slice(),
    );

    let builder = prover.commitment_builder();

    // Commit to each range of the public outbound data which we want to disclose
    let sent_commitments: Vec<_> = sent_public_ranges
        .iter()
        .map(|range| builder.commit_sent(range).unwrap())
        .collect();
    // Commit to each range of the public inbound data which we want to disclose
    let recv_commitments: Vec<_> = recv_public_ranges
        .iter()
        .map(|range| builder.commit_recv(range).unwrap())
        .collect();

    // Finalize, returning the notarized session
    let notarized_session = prover.finalize().await.unwrap();

    // Create a proof for all committed data in this session
    let mut proof_builder = notarized_session.data().build_substrings_proof();

    // Reveal all the public ranges
    for commitment_id in sent_commitments {
        proof_builder.reveal_by_id(commitment_id).unwrap();
    }
    for commitment_id in recv_commitments {
        proof_builder.reveal_by_id(commitment_id).unwrap();
    }

    let substrings_proof = proof_builder.build().unwrap();

    TlsProof {
        session: notarized_session.session_proof(),
        substrings: substrings_proof,
    }
}
