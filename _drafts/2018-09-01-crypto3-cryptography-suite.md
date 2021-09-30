---
title: =nil; Foundation's Cryptography Suite Crypto3
layout: post
date: 2018-09-01
description: Cryptography suite introduction. Rationale.
author: Mikhail Komarov
tags: crypto3 cryptography cpp
comments: false
---

# =nil; Foundation Cryptography Library (libcrypto3)
[![Build Status](https://travis-ci.com/nemo1369/crypto3.svg?token=DHGZQ8ocJtbnXsTs61qE&branch=master)](https://travis-ci.com/nemo1369/crypto3)
[![Coverage Status](https://coveralls.io/repos/github/NilFoundation/crypto3/badge.svg?branch=master)](https://coveralls.io/github/NilFoundation/crypto3?branch=master)

Modern cryptography backend built in C++.

Root repository is stored and managed at https://github.com/nilfoundation/crypto3.
 
 Detailed tutorials and references are available at https://crypto3.nil.foundation.
 
 Developed and supported by Nil Foundation: https://nil.foundation.
  
## Another one? Srsly? Why?

Yeah. There are few more or less complex and complete cryptography libraries for C (OpenSSL, libsoduim, libtomcrypt) 
or C++ (Botan, libcryptopp, libsoduim C++ bindings, OpenSSL C++ bindings) or any other languages (e.g. Bouncy Castle for Java and C#), but none of them contain modern cryptographic protocols such as threshold signature/encryption schemes, zero knowlege proof protocols, homomorphic signatures/encryption, incremental signatures/encryption/hashes, verifiable delay functions etc.

Moreover, some of this libraries are not designed to use all of the C++ advances (syntax and performance)(e.g. Botan is 
designed in a very pythonic way and uses heap extensively which is no good for the low-end systems usage. libcryptopp
 obviously has Windows-based roots which is no good for architecture and extendability reasons).
 
And none of C++ cryptographic libraries are designed well enough to be included in standard libraries. This one targets Boost and formal proposal to STL (maybe later).

## But why don't you just patch/fork existing libraries?

Just like that? https://github.com/cryptonomex/secp256k1-zkp, https://boringssl.googlesource.com/boringssl/ or https://github.com/libressl-portable/openbsd.git

There are so many of these forks and patches which would never be reviewed, that means they would never be safe. Moreover most of these patches/forks are made for some particular purpose (in most cases it is SSL handling) and usually do not get mature and complex enough.

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

## Since this is a backend, what language bindings are available?

For now there are API available for Rust (https://github.com/NilFoundation/crusty3) and Python (https://github.com/NilFoundation/crypto3-python).

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
