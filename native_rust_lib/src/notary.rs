use elliptic_curve::pkcs8::DecodePrivateKey;
use futures::{AsyncRead, AsyncWrite};
use http_body_util::{BodyExt as _, Either, Empty, Full};
use hyper::{client::conn::http1::Parts, Request, StatusCode};
use hyper_util::rt::TokioIo;
use notary_server::{ClientType, NotarizationSessionRequest, NotarizationSessionResponse};
use rustls::{Certificate, ClientConfig, RootCertStore};
use std::sync::Arc;
use tlsn_verifier::tls::{Verifier, VerifierConfig};

const NOTARY_KEY_STR: &str = "-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg0uY1ITka/RnLISi4
WRewfSdLHzX2SDlY4lVQ8FTyBNehRANCAARA1ZIvXZissM8g30mwUb4d8YxuIDyA
43K6xj30MekPDVSltebKZQreqXVljJ0hUbIkCpMLe7UAWlKuJXp7GBQx
-----END PRIVATE KEY-----
";

/// Runs a simple Notary with the provided connection to the Prover.
pub async fn run_notary<T: AsyncWrite + AsyncRead + Send + Unpin + 'static>(
    conn: T,
    max_sent: usize,
    max_recv: usize,
) {
    // Load the notary signing key
    // let signing_key_str =
    //     std::str::from_utf8(include_bytes!("./fixture/notary/notary.key")).unwrap();
    let signing_key = p256::ecdsa::SigningKey::from_pkcs8_pem(NOTARY_KEY_STR).unwrap();

    // Setup default config. Normally a different ID would be generated
    // for each notarization.
    let config = VerifierConfig::builder()
        .id("example")
        .max_sent_data(max_sent)
        .max_recv_data(max_recv)
        .build()
        .unwrap();
    println!("Notary running");
    Verifier::new(config)
        .notarize::<_, p256::ecdsa::Signature>(conn, &signing_key)
        .await
        .inspect_err(|e| eprintln!("Verifier Error: {:?}", e))
        .unwrap();
}
