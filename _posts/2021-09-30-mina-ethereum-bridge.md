---
title: <span style='font-family:Menlo, Courier, monospace'>=nil;</span> Foundation's in-EVM Full Mina State Verification.
layout: post
date: 2021-09-30
excerpt: Paving the way to Ethereum-Mina bridge by full Mina state in-EVM verification made possible by Pickles SNARK (and some more SNARKs).
author: Mikhail Komarov, Ilya Shirobikov, Alisa Cherniaeva
tags: crypto3 cryptography mina
comments: false
---

## Introduction

Back in April of 2021 Mina Foundation together with Ethereum Foundation announced the request for proposals for the design and implementation of a mechanism to verify and the Pickles SNARK on Ethereum: [https://minaprotocol.com/announcements/mina-foundation-and-ethereum-foundation-launch-joint-rfp](https://minaprotocol.com/announcements/mina-foundation-and-ethereum-foundation-launch-joint-rfp). Finally, after a rigorious selection process, =nil; Foundation's =nil; Crypto3 team [was awarded](https://twitter.com/minaprotocol/status/1443599014797135872?s=21) with an opportunity to facilitate such a project.

So this is the first within the series of blog posts covering some aspects of such a bridge implementation.

## So what? 

Since the whole Mina Protocol state (except archive nodes) can be and is packed within the single Pickles SNARK proof (remember - 22kb only) ([https://medium.com/minaprotocol/meet-pickles-snark-enabling-smart-contract-on-coda-protocol-7ede3b54c250](https://medium.com/minaprotocol/meet-pickles-snark-enabling-smart-contract-on-coda-protocol-7ede3b54c250)), this means it is possible to put the whole Mina Protocol state right onto Ethereum. Moreover, this means for the whole Mina Protocol state is in-EVM verifiable within a reasonable gas cost.

A full Mina Protocol state in-EVM verification means it will be possible to bring everything that happens inside of the Mina chain to Ethereum, including financial applications, provable computations, and much more.

## Okay. How in particular?

Unfortunately it turned out that direct verification of Pickles SNARK on the EVM appears to be too costly. But! It seemed to be possible to design a system that may perform some preprocessing on the Pickles SNARK (e.g., by computing a STARK that verifies the Pickles SNARK which itself may be efficiently verified on the EVM).

>   In particular. The Pickles SNARK verifier as used in Mina has several components:
>   1. Computing several hash values from the data of the proof. This involves using 
>       the Poseidon hash function with 63 full rounds both over $F_p$ and $F_q$ with 
>       round constants and MDS matrix specified 
>       [here for Fp](https://github.com/o1-labs/marlin/blob/master/oracle/src/pasta/fp.rs) 
>       and [here for Fq](https://github.com/o1-labs/marlin/blob/master/oracle/src/pasta/fq.rs).
>       This step is fairly cheap and could likely be implemented with reasonable gas cost on EVM.
>   2. Checking several arithmetic equations. Again, this step is fairly cheap and could be implemented directly on EVM.
>   3. Performing one multi-scalar multiplication (MSM) of size $2n_2 + 4 + (2 + 25) = 63$
>      for which some of the bases are fixed and some are variable. The step could likely be 
>      implemented directly on EVM with reasonable efficiency, although it is likely to be more 
>      expensive than steps 1 and 2.
>   4. For each i, performing a multi-scalar multiplication over $G_i$ of size
>      $2^{n_i}$ with a fixed array of bases, and with scalars that can be very 
>      efficiently computed from the proof.
>
>   Step 4 is what turned out not to be possible to be efficiently computed 
>   directly on EVM, unless the computation is split over several blocks. 

So, this was exactly the approach taken.

## Auxiliary STARK-based proof.

The threshold cost of Mina state verification was set to be 5m gas. Direct Pickles proof verification would've taken much more. The [RFP by Ethereum Foundation and Mina Foundation](https://hackmd.io/u_2Ygx8XS5Ss1aObgOFjkA?view%23Definitions) suggested an approach which would result in submitting to EVM an additional STARK proof of a successful Pickles SNARK proof part verification, which could be considered as a valid in-EVM confirmation of everything what happened inside Mina. Such an approach - submitting proof of successfull proof verification - seemed to be fitting into 5m gas. Future was clear and bright.

> We even suggested the following basic circuit for the STARK-based auxiliary proof.
> 
> The proof was supposed to be generated for the following basic constraints 
> (represents [Step 4 of the verification algorithm](https://hackmd.io/u_2Ygx8XS5Ss1aObgOFjkA?view\#Definitions)).  
> Let:  
>  1. $P_1$, $P_2$ be the MSM results.  
>  2. $n_1$, $n_2$ be the MSM sizes.  
>  3. $G_2 = [G_{1, 0}, ..., G_{1, n_1 - 1}]$,  $G_2 = [G_{2, 0}, ..., G_{2, n_2 - 1}]$ be sets of fixed points.  
>
> Then for $k = 1, 2$:
>   1. $R_0 = (0 : 1 : 0)$  
>   2. $\forall 0 \leq i < n_k : R_{i + 1} =  R_{i} + f(s_i, G_{k, i + 1})$  
>   3. $R_{n_k - 1} - P_k = (0 : 1 : 0)$  
>      where
>      $f(s_i, G_{k, i + 1})$
>      calculates the new scalar $s_{i + 1}$ from the previous one and multiplies it on the point $G_{k, i + 1}$. 
> 
> The basic constraints will be optimized (using addition chains, Pipepnger's-like 
> approach, and STARK-friendly math) to provide better performance for the 
> prover and lower gas-cost for the verifier.
> Additional research will determine whether Step 3 of the verification algorithm 
> needs to be included in the auxiliary proof or it needs to be verified directly 
> on the Ethereum smart contract. 

But then, suddenly, even 5m gas turned out to be too expensive (thank you, 2021!).

## Making things cheaper.

STARK-based auxiliary proof verification turned out to be too expensive for the task as well. So we started looking for a different SNARK to be used within the auxiliary proof.

After a brief discussion, Rank-1 Constraint System-based SNARKs were crossed out as too costy ones as well. Even considering some of them were transparent and very promising (e.g. Spartan), which would've brought a nice feature of absence of necessity to trust any set of actors to generate the proof for the Ethereum submittance. Imagine if you would be required to trust a group of people who did trusted setup so anyone capable of generating Mina state proof rely on them? Too much trust for that. That is why SNARK transparency was a non-optional requirement.

> How much would've R1CS systems usage cost roughly? Well, let us calculate that. 
>
> We need to perform a multiexp of size $2^{18}$ and one of size $2^{17}$ in a different curve.
> 
> The best constraint cost per bit possible within R1CS systems is 1 bits of scalar 
> multiplication in 6 constraints.
> 
> $2^{18}$ scalar multiplications $\times$ ($255$ bits per scalar multiplication $\times$ 
> ($6$ constraints / $1$ bits)) = $401080320$ constraints
> 
> So, given that, if we use the sqrt(N)-cost DLOG-based polynomial commitment scheme 
> to instantiate the polynomial commitment scheme, the verifier will have to do a 
> multiexp of size $\sqrt{401080320} = 20026$.
> 
> Previous estimations were made using a naive multiexp algorithm. If instead 
> Pippenger's > algorithm was used, which performs roughly $2 \times s \times n / log2(s \times n)$ 
> group operations where $n$ is the size of > the multiexp (i.e., $n = 20026$) and 
> $s$ the size of scalars (i.e., $s = 255$).
> Using Jacobian coordinates, it's about $16$ field multiplications per group 
> operation, and on EVM each field operation uses about $8$ gas.
> 
> So in total the EVM cost is (very optimistically):  
> $(2 \times 255 \times 20026 / log_{2}(255 \times 20026)) \times 16 \times 8 = 58,665,445$ gas
> 
> Then it is also required to do a size $2^{17}$ multiexp which comes out to $14161$ constraints which will be:  
> $(2 \times 255 \times 14161 / log_{2}(255 \times 14161)) \times 16 \times 8 = 42,436,216$ gas
> 
> So roughly 101,101,661 gas in total. The constraint cost is optimistic because 
> there are more things that will have to happen inside the circuit, and the gas 
> cost is optimistic because Pippinger has costs other than group operations which 
> may be expensive on EVM, and also because the onchain verifier will have to perform 
> additional operations
>
> No R1CS-based systems are usable for such a task.

PLONK-based proof schemes are usually considered as ones with cheaper verification cost. 
But most of them (because of the most common commitment scheme used - Kate commitment 
scheme) trusted setup is required.

## So how to keep the bridge trustless along with keeping it cheap?

To figure out a custom SNARK for the auxiliary proof. That is how. 
Well, not a really custom one (let us not exaggerate things), but a novel proof 
scheme.

In particular, RedShift-alike approach was selected (PLONK-based syntax over FRI
commitment scheme). FRI commitment scheme brings transparency to auxiliary SNARK 
proof and using PLONK-based syntax allows to reduce the resulting circuit.

This also resulted in much better costs: $3594270$ gas for a single verificaton.

> In particular. The main verifier's costs now were Merkle proof verification 
> ($\log^2n + 2 \cdot \log 2 n)$) and low-degree testing ($\log n$), where $n$ 
> is commited polynomial's degree. According to [https://eprint.iacr.org/2019/1400.pdf](https://eprint.iacr.org/2019/1400.pdf), 
> $n = \text{rows} \cdot (\text{wires} + 1)$. 
> For simplicity, only lead costs were considered for low degree tests that is 
> two inversion over finite field (~$30000$ gas). Keccak256 costs 30 gas. 
>
> Scalar multiplication was still the most consuming part of both of these
> components, so it was required to get the proper PLONK gate construction done.
>
> According to Daira's resuls in here:
> [https://github.com/zcash/zcash/issues/4254#issuecomment-565761663](https://github.com/zcash/zcash/issues/4254#issuecomment-565761663), 
> it seemed to be possible to perform a single scalar multiplication round in 3 PLONK gates
> (resulting in polynomial constraints with a degree 3) per scalar bit (3 columns,
> 3 rows per multiplication).
> 
> The rows number: $2^{18} \times 255 \times 3 \times 4 = 802160640$ rows.
> 
> Low degree tests: $log(802160640) = 30$.
> 
> Merkle tree operations: $\log^2 802160640 + 2 * \log 802160640 = 935$ 
> 
> Overall gas costs: $2 \times 30 \times 30000 + 935 * 30 = 1828050$ gas.
> 
> Since it is also required to do a multiexp of a size $2^{17}$ as well, repeating
> the same steps for a different size leads to $2^{17} \times 255 \times
> 3 \times 4 = 401080320$ rows, which leads to the low degree tests number
> $log(401080320) =  29$.
> 
> And merkle ops number: $\log^2 401080320 + 2 * \log 401080320 = 874$
> 
> Overall gas costs: $2 \times 29 \times 30000 + 935 * 874 = 1766220$ gas.
> 
> Leading verification cost gets brought by these two MSMs, so in total they would
> roughly consume: $1828050 + 1766220 = 3594270$ gas.
> 
> Since the limit is $5000000$ gas and some underestimation is definitely present,
> such scalar multiplication gate structure approach seams feasible (even if it
> is a very rough estimation). More verification costs will be brought by Poseidon
> hash computations and a linear size MSM calculation.

## Sold. When?

The first milestone on the way is to introduce a very particular and well-optimized auxiliary proof circuit design to dot the i's and cross the t's (along with reducing the verification cost even more). This is expected to be done in Q4 2021 (Nov 2021 most probably). The production version is supposed to be launched around the end of Q1 2022.

Such a particular design will result in one more blog post with a descibtion. We will keep you updated!
