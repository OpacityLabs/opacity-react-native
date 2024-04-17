# React Native TLSN

### Add ios target

```
rustup target add aarch64-apple-ios aarch64-apple-ios-sim
cargo install cbindgen
```

### Build for Simulator

```
yarn run cargo-ios-sim
yarn run pod-install
yarn run ios
```


### Build for Native

```
yarn run cargo-ios
yarn run pod-install
...
```


### Generating MPC-TLS Proof

Example can be found in src/screens/Profile/index.tsx:159

```
{profile && token && <Pressable
    className="h-14 w-full items-center justify-center rounded-full border border-black bg-white"
    onPress={(async () => {
    const request = notarizeDoorDashProfileRequest(token)
    const proof = await generateDoorDashProof(request)
    console.log('MPC-TLS Proof', proof)
    })}>
    <Text className="text-lg text-black">Generate proof</Text>
</Pressable>}
```
