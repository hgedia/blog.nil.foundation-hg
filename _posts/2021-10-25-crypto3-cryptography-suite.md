---
title: <span style='font-family:Menlo, Courier, monospace'>=nil;</span> Crypto3 Cryptography Suite.
layout: post
date: 2021-10-25
excerpt: Cryptography Suite for zk-Rollups, zk-Bridges and much more.
author: Mikhail Komarov
tags: crypto3 cryptography cpp
comments: false
---

## What is this about?

This post is a response to the question we've received about isn't it too much 
to try to build two pretty complex zk-bridges at the same time.

The answer is No.

## Oh. You're going to pitch some "Secret Sauce" of yours now?

Well, not a "Secret Sauce", but just a project of ours behind those bridges.
First one within a couple mentioned within our [Twitter "About" section](https://twitter.com/nil_foundation) ("Home foundation for <span style='font-family:Menlo, Courier, monospace'>=nil;</span> Crypto3 and <span style='font-family:Menlo, Courier, monospace'>=nil;</span> DBMS projects").

So, can I start?

## Okay. Go on.

As it can be noticed, all of the bridges of ours use pretty much the same approach: 
wrapping a heavy proof verification (or some heavy data set verification) into a 
verification of a lighter proof, which proves the successfull verification of the 
initial heavier proof.

This allows complicated data structures (in Solana's case it is a "light-client" 
state, in Mina's case it is a Pickles SNARK proof) to be succesfully verified on 
EVM by verifying a lighter proof which proves the initial data correct verification. 
So the whole construction stays formally secure and correct.

Such approach combined with the [LPC commitment scheme](https://eprint.iacr.org/2019/1400.pdf) 
gives the transparency properties, which in practice means the absence of a need 
for a proof system trusted setup, which in its turn makes such bridges completely 
trustless.

Sounds like the approach for a framework, right?

## Yes. Sounds like that.

That is why we decided to wrap this approach into the framework based on the 
cryptography suite of ours.

## Which is?

Crypto3 C++ Cryptography Suite ([https://github.com/nilfoundation/crypto3](https://github.com/nilfoundation/crypto3))

## Another one? Seriously? In C++? Why?

Yeah. Back then, in April of 2018, there were few more or less complex and complete and proven classic cryptography suites libraries for in C (OpenSSL, libsoduim, libtomcrypt) or C++ (Botan, libcryptopp, libsoduim C++ bindings, OpenSSL C++ bindings) and some early-stage Rust-based developments, which everyone was building their signatures and hashes on top of.
More sophisticated ones included suites like [libsnark](https://github.com/scipr-labs/libsnark), [5GenCrypto](https://github.com/5GenCrypto), and [ZCash-originated developments](https://github.com/zcash), which were far from what we needed. Also none of cryptography suites mentioned contained threshold signature/encryption schemes, zero-knowledge proof systems, homomorphic signatures/encryption and verifiable delay functions and lots of other things all at once.

## But why don't you just patch/fork/extend existing libraries?

Just like that: [https://github.com/filecoin-project/bellperson.git](https://github.com/filecoin-project/bellperson.git), [https://github.com/cryptonomex/secp256k1-zkp](https://github.com/cryptonomex/secp256k1-zkp), [https://boringssl.googlesource.com/boringssl/](https://boringssl.googlesource.com/boringssl/) or [https://github.com/libressl-portable/openbsd.git](https://github.com/libressl-portable/openbsd.git) ?

Most of these patches/forks were made for some particular purpose and usually do not meet the requirements of handling enough of schemes and primitives at once. So patching those would result in the same thing - extensive refactoring, which sometimes gets even more complicated than implementing things from scratch.

## Fine. A library of your own. What is so special about it?

Well, first of all, its size. It is not just a library, it is a suite, which consists of 39 libraries, representing literally every field of modern applied cryptography. Since the April of 2018 we've put pretty much everything you can think of inside of it: VDFs, signature schemes (including threshold ones with various DKGs), zero-knowledge proof systems (R1CS and PLONK-based ones), more traditional cryptography notions (block ciphers, hashes, message authentication codes, key deriveation functions etc). Full list is available in here: [https://crypto3.nil.foundation/projects/crypto3/modules.html](https://crypto3.nil.foundation/projects/crypto3/modules.html) along with documentation to each module in here: [https://crypto3.nil.foundation/projects/crypto3/pages.html](https://crypto3.nil.foundation/projects/crypto3/pages.html).

## What for?

Well, all the projects we've accomplished were either based on top or eventually ended up inside of the cryptography suite of ours. Those old [Chia Network VDF](https://www.chia.net/2019/07/18/chia-vdf-competition-round-2-results-and-announcements.en.html) and [ProofOfSpace](https://github.com/Chia-Network/proofofspaceresults) competitions results found their place among VDF's implementations within the [Crypto3.VDF](https://github.com/NilFoundation/crypto3-vdf) module of ours In particular: [https://github.com/NilFoundation/crypto3-vdf/blob/master/include/nil/crypto3/vdf/chia.hpp](https://github.com/NilFoundation/crypto3-vdf/blob/master/include/nil/crypto3/vdf/chia.hpp). 

Our Filecoin-related effors (proof generation performance speed-ups and C++ Filecoin Proofs implementation) eventually found their place among the developments based on top of the cryptography suite: [https://github.com/NilFoundation/crypto3-fil-proofs](https://github.com/NilFoundation/crypto3-fil-proofs) (not finished and will probably not be finished, but anyway).

Same thing happened with [Mina-Ethereum](https://blog.nil.foundation/2021/09/30/mina-ethereum-bridge.html), ([https://github.com/nilfoundation/evm-mina-verification.git](https://github.com/nilfoundation/evm-mina-verification.git)) and [Solana-Ethereum](https://blog.nil.foundation/2021/10/14/solana-ethereum-bridge.html), ([https://github.com/nilfoundation/evm-solana-verification.git](https://github.com/nilfoundation/evm-solana-verification.git)) zk-bridges projects of ours.

That is what for.

## Okay. Next question. Who uses C++ in 2021?

It is just a tool. Complicated but reliable, mature and time-proven. No special feelings in here.

To minimize complexities induced by such a toolchain usage, we decided to:
- Design the suite architecture from the scratch to keep the API clean out of backward compatibility.
- Design the API to be very similar to STL ([hashing example](https://crypto3.nil.foundation/projects/crypto3/df/d2e/hashes_usage_manual.html). We even had a special Boost-dedicated version, intended to be proposed to Boost and then to standartization commitee (WG21) one day ([https://github.com/nilfoundation/boost-crypto3](https://github.com/nilfoundation/boost-crypto3)), so in case it gets accepted it would be possible to do basic cryptography (we hadn't proposed more advanced modules to the WG21) with STL right out of the box.
  > That is how would an Boost/STL-enabled AES-128 encryption look like:
  >
  >     #include <boost/crypto3/block/aes.hpp>
  >     #include <boost/crypto3/block/algorithm/encrypt.hpp>
  >     
  >     #include <string>
  >     #include <cassert>
  >     
  >     using namespace boost::crypto3;
  >     
  >     int main() {
  >         std::string input =
  >             "\x6b\xc1\xbe\xe2\x2e\x40\x9f\x96"
  >             "\xe9\x3d\x7e\x11\x73\x93\x17\x2a"
  >             "\xae\x2d\x8a\x57\x1e\x03\xac\x9c"
  >             "\x9e\xb7\x6f\xac\x45\xaf\x8e\x51"
  >             "\x30\xc8\x1c\x46\xa3\x5c\xe4\x11"
  >             "\xe5\xfb\xc1\x19\x1a\x0a\x52\xef"
  >             "\xf6\x9f\x24\x45\xdf\x4f\x9b\x17"
  >             "\xad\x2b\x41\x7b\xe6\x6c\x37\x10";
  >     
  >         std::string key =
  >             "\x2b\x7e\x15\x16\x28\xae\xd2\xa6"
  >             "\xab\xf7\x15\x88\x09\xcf\x4f\x3c";
  >     
  >         std::string out = encrypt<block::aes<128>>(input.begin(), 
  >                                                    input.end(), 
  >                                                    key.begin(), 
  >                                                    key.end());
  >     
  >         return (out ==
  >                "3ad77bb40d7a3660a89ecaf32466ef97f5d3d58503b9699de785895a96fdbaaf"
  >                "43b1cd7f598ece23881b00e3ed0306887b0c785e27e8ad3f8223207104725dd4");
  >     }
- Make it a fool-proof by employing massive amount of compile-time correctness checks. So now it is as close as possible to the state "if it compiles, then it works correctly". Every usage mistake which can be made will be prevented during the compilation.
- Make it comfortable for prototyping novel schemes/proof systems/hashes/other by keeping the implementation as close to formal constructions.

## How can that be comfortable at all?

Hashes, for example, have their [Merkle-Damgard](https://github.com/NilFoundation/crypto3-hash/blob/master/include/nil/crypto3/hash/detail/merkle_damgard_construction.hpp#L55) or [Sponge](https://github.com/NilFoundation/crypto3-hash/blob/master/include/nil/crypto3/hash/detail/sponge_construction.hpp#L56) constructions defined with explicit reprensentations, which make it easy to map the implementation to the definition given within the paper or specification. Such representations, though, get elliminated during compilation so they do not affect the performance. So defining a new hash goes down to something similar to "I want a hash, based on Sponge construction with a compressor defined as follows (here goes the definition of a compressor)". [Poseidon hash is defined](https://github.com/NilFoundation/crypto3-hash/blob/master/include/nil/crypto3/hash/poseidon.hpp#L53) exactly this way. With, speaking in terms of software architecture, a stateless policy class, simply defining proper types inside.

More on prototyping new hashes can be found on the [Crypto3.Hash "Implementation" page](https://crypto3.nil.foundation/projects/crypto3/dd/d9f/hashes_impl.html). Most of suite modules do have similar tutorials on [https://crypto3.nil.foundation/projects/crypto3/pages.html](https://crypto3.nil.foundation/projects/crypto3/pages.html).

Another example is an [LPC](https://github.com/NilFoundation/crypto3-zk/blob/20-plonk-impl/include/nil/crypto3/zk/snark/commitments/list_polynomial_commitment.hpp#L51) or [FRI](https://github.com/NilFoundation/crypto3-zk/blob/20-plonk-impl/include/nil/crypto3/zk/snark/commitments/fri_commitment.hpp) commitment schemes which were given the same interface, so changing the commitment scheme within the proof system is as easy as changing the template parameter.

## Alright. Back to bridges. Can this framework on top of the suite of yours be reused?

Sure. Any of currently existing bridges repositories ([https://github.com/nilfoundation/evm-mina-verification.git](https://github.com/nilfoundation/evm-mina-verification.git) or [https://github.com/nilfoundation/evm-solana-verification.git](https://github.com/nilfoundation/evm-solana-verification.git)) can be reused for the purpose of creating a new bridge.

All of them consist of several parts:
1. Wrapping proof generator. Usually emplaced in `bin` directory. Uses RedShift 
   (or any other) proof system and FRI/LPC commitment scheme (or any other) definitions 
   from [Crypto3.ZK](https://github.com/nilfoundation/crypto3-zk.git).
2. Circuit definition done with [Crypto3.Blueprint](https://github.com/nilfoundation/crypto3-blueprint.git).
3. Proof verification logic. In-EVM one most often. Sometimes other virtual machines get involved as well.
4. [Crypto3](https://github.com/nilfoudation/crypto3) libraries introduced as
   submodules in `libs` directory.

This results in a executable (not matter if it is native or not) generating a 
RedShift proof for a circuit, defined with a 
[Crypto3.Blueprint](https://github.com/nilfoundation/crypto3-blueprint.git)
library, which complies with the virtualized verification logic input format,
defined within the same repository in Solidity files. Same architecture for every
zk-bridge core solution, the only difference is a circuit.

And, here we go. A reusable framework for completely trustless bridges.

### So, which cluster gets its trustless bridge next?
