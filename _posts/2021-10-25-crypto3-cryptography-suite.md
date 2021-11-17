---
title: =nil; Crypto3 Cryptography Suite.
layout: post
date: 2021-10-25
excerpt: Cryptography Suite for zk-Rollups, zk-Bridges and much more.
author: Mikhail Komarov
tags: crypto3 cryptography cpp
comments: false
---

## What is that about?

This post is a response to the numerous amount of questions we've received about 
isn't it too much to try to build two pretty complex zk-bridges at the same time.

The answer is No.

## Oh. You're going to pitch some "Secret Sauce" of yours now?

Well, not a "Secret Sauce", but just a tool of ours.

So, can I start?

## Okay. Go on.

As it can be noticed, all of the bridges of ours use pretty much the same approach: wrapping a heavy proof verification into a verification of a lighter proof, which proves the successfull verification of the initial heavier proof.

This allows larger datasets to be succesfully verified while the whole construction stays formally secure and correct.

Such approach combined with FRI commitment scheme gives the transparency properties, which in practice means the absence of a need for a proof system trusted setup, which in its turn makes such bridges completely trustless.

Sounds like the approach for a framework, right?

## Yes. Sounds like that.

That is why we decided to wrap this approach into the framework based on the cryptography suite of ours.

## Which is?

Crypto3 C++ Cryptography Suite ([https://github.com/nilfoundation/crypto3](https://github.com/nilfoundation/crypto3))

## Another one? Srsly? In C++? Why?

Yeah. Back then, in April of 2018, there were few more or less complex and complete and proven classic cryptography suites libraries for in C (OpenSSL, libsoduim, libtomcrypt) or C++ (Botan, libcryptopp, libsoduim C++ bindings, OpenSSL C++ bindings) and some early-stage Rust-based developments, which everyone was building their signatures and hashes on top of.
More sophisticated ones included suites like libsnark ([https://github.com/scipr-labs/libsnark](https://github.com/scipr-labs/libsnark)), 
5GenCrypto ([https://github.com/5GenCrypto](https://github.com/5GenCrypto)), and ZCash-related developments ([https://github.com/zcash](https://github.com/zcash)), which were far from what we needed. Also none of cryptography suites mentioned contained threshold signature/encryption schemes (you will get why we need it later), zero-knowledge proof systems, homomorphic signatures/encryption and verifiable delay functions and lots of other things all at once.

## But why don't you just patch/fork existing libraries?

Just like that: https://github.com/filecoin-project/bellperson.git, https://github.com/cryptonomex/secp256k1-zkp, https://boringssl.googlesource.com/boringssl/ or https://github.com/libressl-portable/openbsd.git ?

Most of these patches/forks were made for some particular purpose and usually do not meet the requirements of handling enough of schemes and primitives at once. So patching those would result in the same thing - extensive refactoring, which sometimes gets even more complicated than implementing things from scratch.

## Fine. A library of your own. What is so special about it?

Well, first of all, its size. Since the April of 2018 we've put pretty much everything you can think of inside of it: VDFs, signature schemes (including threshold ones with various DKGs), zero-knowledge proof systems (R1CS and PLONK-based ones), more traditional cryptography notions (block ciphers, hashes, message authentication codes, key deriveation functions etc). Full list is available in here: https://crypto3.nil.foundation/projects/crypto3/modules.html.

## What for?

Well, all the projects we've accomplished were based on top of it or whatever we did eventually ended up inside of the cryptography suite of ours. Those old Chia Network VDF (https://www.chia.net/2019/07/18/chia-vdf-competition-round-2-results-and-announcements.en.html) and ProofOfSpace competitions (https://github.com/Chia-Network/proofofspaceresults) found their place among VDF's implementations within the Crypto3.VDF module of ours: https://github.com/NilFoundation/crypto3-vdf and in particular https://github.com/NilFoundation/crypto3-vdf/blob/master/include/nil/crypto3/vdf/chia.hpp. Our Filecoin-related effors eventually found their place among the developments based on top of the cryptography suite: https://github.com/NilFoundation/crypto3-fil-proofs.

Same thing happened with Mina-Ethereum (https://blog.nil.foundation/2021/09/30/mina-ethereum-bridge.html) and Solana-Ethereum (https://blog.nil.foundation/2021/10/14/solana-ethereum-bridge.html) zk-bridges projects of ours.

That is what for.

## Why this library is not just another patch/fork?

For several reasons:
- This library accumulates best known implementations of classic cryptography notions (listed below) and modern protocols (listed below), so it is designed to handle this stuff together in a convenient way.
- This library architecture is redesigned from the scratch to keep the ABI clean out of backward compatibility.
- This library contains some of the self-designed cryptographic protocols (e.g. ECDSA threshold signature scheme faster and lighter than the Genarro's most recent presented at CCS'18)(Paper coming soon, be patient).
- This library is designed to be a suite for fast and efficient implementation of experimental cryptographic 
protocols. It contains literally every primitive required.  
- The ABI is designed in the same way as the STL algorithms do (an example and reference link are provided below).
- Such an ABI design enables easier implementation of various language bindings. (e.g. Python bindings would never 
require class object bindings, just a function getting some byte blobs) This (and also byte blob internal structure 
conversions) makes a library not just a library, but a backend-library (For now in most cases OpenSSL gets used for 
this purpose. But OpenSSL was not designed for such a usage, 'cause it does not even contains byte blob type 
conversions, it uses raw data format which differs from platform to platform (sic!) ). Separate foreign functions 
interface library is responsible for bindings. 
- Coming to C++-specific features, this library ABI supports ranges (Yay!)(for now it is Boost.Range, but Eric 
Neibler's STL formal proposal library https://github.com/ericniebler/range-v3 is coming) and adaptors (Yay once 
again!). This enables full-featured functional-style development.

## Okay. What is inside?

Lots of stuff. But don't be too anticipated. Most of this stuff is still in development or refactoring.

Complete list is available at https://crypto3.nil.foundation/modules.html

Next comes the short list of features library:
 - Contains
 - Contains, but still in development in private repositories (marked with *)
 - Intends to contain (marked with **) 

### Block Ciphers

- ARIA
- Blowfish
- Camellia
- Cast128
- Cast256
- DES
- TripleDES
- DESX
- GOST-28147
- IDEA
- Kasumi
- MD4
- MD5
- Misty1
- Noekeon 
- Rijndael
- Seed
- Serpent
- Shacal
- Shacal2
- SM4
- Threefish
- Twofish
- Xtea

### Hash Functions & Checksums

#### Non-cryptographically strong hashes

- Adler
- CRC-family checksums
- xxHash
- MurmurHash

#### Cryptographically strong hashes

- Blake2b
- Cubehash
- GOST-3411
- Skein-512
- SM3
- Streebog
- Tiger
- Whirlpool
- Keccak
- SHA-family hashes
- SHA-3
- MD4
- MD5
- Ripemd-family

### Stream Ciphers

- ChaCha20
- Salsa20/XSalsa20
- RC4

### Message Authentication Codes

- HMAC
- CMAC
- Poly1305
- SipHash
- GMAC
- CBC-MAC
- X9.19 DES-MAC

### Authenticated cipher modes 
- EAX
- OCB
- GCM
- SIV
- CCM
- ChaCha20Poly1305

### Cipher modes
- CTR
- CBC
- XTS
- CFB
- OFB

### Public Key Cryptography

#### Single-party schemes

- RSA signatures and encryption
- Diffie–Hellman (DH) key exchange and Diffie–Hellman key exchange over elliptic curves (ECDH)
- DSA and ECDSA
- Ed25519
- ECGDSA
- ECKCDSA
- SM2
- GOST 34.10-2001

#### Multiparty schemes 

* Threshold signature schemes: ECDSA (constructed by the library author), ECDH (constructed by the library author)
* Variable-Weight (VW) threshold signature and encryption scheme
* Boneh-Lynn threshold signature scheme
* Post-quantum signature scheme XMSS
* Post-quantum key agreement schemes McEliece and NewHope
* ElGamal encryption
* Padding schemes OAEP, PSS, PKCS #1 v1.5, X9.31

### Zero-Knowledge Proof Protocols

* zkSNARKs and zkSTARKs (with various hash-type parameterization)
* Bulletproofs (https://web.stanford.edu/~buenz/pubs/bulletproofs.pdf)
