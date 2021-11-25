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

Well, not a "Secret Sauce", but just a project of ours which backs those bridges.
First one within a couple mentioned within our [Twitter "About"
section](https://twitter.com/nil_foundation).

So, can I start?

## Okay. Go on.

As it can be noticed, all of the bridges of ours use pretty much the same approach: 
wrapping a heavy proof verification (or some heavy data set verification) into a 
verification of a lighter proof, which proves the successfull verification of the 
initial heavier proof.

This allows larger datasets to be succesfully verified while the whole construction 
stays formally secure and correct.

Such approach combined with FRI commitment scheme gives the transparency properties, 
which in practice means the absence of a need for a proof system trusted setup, 
which in its turn makes such bridges completely trustless.

Sounds like the approach for a framework, right?

## Yes. Sounds like that.

That is why we decided to wrap this approach into the framework based on the 
cryptography suite of ours.

## Which is?

Crypto3 C++ Cryptography Suite ([https://github.com/nilfoundation/crypto3](https://github.com/nilfoundation/crypto3))

## Another one? Seriously? In C++? Why?

Yeah. Back then, in April of 2018, there were few more or less complex and complete and proven classic cryptography suites libraries for in C (OpenSSL, libsoduim, libtomcrypt) or C++ (Botan, libcryptopp, libsoduim C++ bindings, OpenSSL C++ bindings) and some early-stage Rust-based developments, which everyone was building their signatures and hashes on top of.
More sophisticated ones included suites like libsnark ([https://github.com/scipr-labs/libsnark](https://github.com/scipr-labs/libsnark)), 5GenCrypto ([https://github.com/5GenCrypto](https://github.com/5GenCrypto)), and ZCash-originated developments ([https://github.com/zcash](https://github.com/zcash)), which were far from what we needed. Also none of cryptography suites mentioned contained threshold signature/encryption schemes (which are required for such bridges as we do), zero-knowledge proof systems, homomorphic signatures/encryption and verifiable delay functions and lots of other things all at once.

## But why don't you just patch/fork/extend existing libraries?

Just like that: [https://github.com/filecoin-project/bellperson.git](https://github.com/filecoin-project/bellperson.git), [https://github.com/cryptonomex/secp256k1-zkp](https://github.com/cryptonomex/secp256k1-zkp), [https://boringssl.googlesource.com/boringssl/](https://boringssl.googlesource.com/boringssl/) or [https://github.com/libressl-portable/openbsd.git](https://github.com/libressl-portable/openbsd.git) ?

Most of these patches/forks were made for some particular purpose and usually do not meet the requirements of handling enough of schemes and primitives at once. So patching those would result in the same thing - extensive refactoring, which sometimes gets even more complicated than implementing things from scratch.

## Fine. A library of your own. What is so special about it?

Well, first of all, its size. Since the April of 2018 we've put pretty much everything you can think of inside of it: VDFs, signature schemes (including threshold ones with various DKGs), zero-knowledge proof systems (R1CS and PLONK-based ones), more traditional cryptography notions (block ciphers, hashes, message authentication codes, key deriveation functions etc). Full list is available in here: [https://crypto3.nil.foundation/projects/crypto3/modules.html](https://crypto3.nil.foundation/projects/crypto3/modules.html).

## What for?

Well, all the projects we've accomplished were based on top of it or whatever we did eventually ended up inside of the cryptography suite of ours. Those old Chia Network VDF ([https://www.chia.net/2019/07/18/chia-vdf-competition-round-2-results-and-announcements.en.html](https://www.chia.net/2019/07/18/chia-vdf-competition-round-2-results-and-announcements.en.html)) and ProofOfSpace competitions ([https://github.com/Chia-Network/proofofspaceresults](https://github.com/Chia-Network/proofofspaceresults)) found their place among VDF's implementations within the Crypto3.VDF module of ours: [https://github.com/NilFoundation/crypto3-vdf](https://github.com/NilFoundation/crypto3-vdf) and in particular [https://github.com/NilFoundation/crypto3-vdf/blob/master/include/nil/crypto3/vdf/chia.hpp](https://github.com/NilFoundation/crypto3-vdf/blob/master/include/nil/crypto3/vdf/chia.hpp). Our Filecoin-related effors eventually found their place among the developments based on top of the cryptography suite: [https://github.com/NilFoundation/crypto3-fil-proofs](https://github.com/NilFoundation/crypto3-fil-proofs) (not finished and will probably not be finished, but anyway).

Same thing happened with Mina-Ethereum ([https://blog.nil.foundation/2021/09/30/mina-ethereum-bridge.html](https://blog.nil.foundation/2021/09/30/mina-ethereum-bridge.html)) and Solana-Ethereum ([https://blog.nil.foundation/2021/10/14/solana-ethereum-bridge.html](https://blog.nil.foundation/2021/10/14/solana-ethereum-bridge.html)) zk-bridges projects of ours.

That is what for.

## Okay. Next question. Who uses C++ in 2021?

Well, to be honest, we consider that simply as a tool. Complicated but reliable, mature and time-proven. No special feelings in here.

To minimize complexities induced by such a tool usage, we decided to:
- Design the suite architecture from the scratch to keep the API clean out of backward compatibility.
- Design the API to be very similar to STL (block cipher encryption example: [https://github.com/NilFoundation/boost-crypto3/blob/master/example/encrypt.cpp#L24](https://github.com/NilFoundation/boost-crypto3/blob/master/example/encrypt.cpp#L24). We even had a special Boost-dedicated version, intended to be proposed to Boost and then to standartization commitee (WG21) one day ([https://github.com/nilfoundation/boost-crypto3](https://github.com/nilfoundation/boost-crypto3)).
- Make it a fool-proof by employing massive amount of compile-time correctness checks. So now it is as close as possible to the state "if it compiles, then it works correctly". Every usage mistake which can be made will be prevented during the compilation.
