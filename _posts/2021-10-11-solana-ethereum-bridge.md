---
title: =nil; Foundation's In-EVM Solana State Verification.
layout: post
date: 2021-10-11
description: Paving the way to Solana-Ethereum zk-bridge.
author: Mikhail Komarov, Ilya Shirobokov, Alisa Cherniaeva
tags: crypto3 cryptography solana 
comments: false
---

## Introduction

This is the first within the series of blog posts covering some aspects of 
tokenless zero-knowledge proof system-based in-EVM [Solana "light client"](https://docs.solana.com/proposals/simple-payment-and-state-verification#light-clients) state verification.

Solana's September 2021 was enlightened by the launch of the second version of 
[Ethereum-Solana bridge](https://wormholebridge.com/).
A bridge of a proven architecture (a set of so-called "stakers" maintaining a 
relay cluster consistent), backed by a solid team with enough value "locked" within the
relay cluster to consider it reliable. But is it really required to have any 
value locked at all to achieve trustless bridging? Do we really need any so-called 
"tokens" for the bridging to be possible?

The answer is NO.

## Emm. What?

Yes. Those bridges usually do that to make cross-cluster data transmissions 
trustful, to make someone responsible for that to be able to whip them in case 
something goes wrong. Such an approach makes such an architecture at least reliable 
enough for everything not to fall apart right after the first data transmit from 
cluster A (e.g. Solana) comes into the cluster B (e.g. Ethereum).

But what if we remove such a data trustfulness requirement? What if we make the
data generated from cluster A (e.g. Solana) in-EVM verifiable so it could be 
either proven valid, or rejected at all?

## How is that?

Zero-Knowledge tricks. Yeah.

## But all of the Zero-Knowledge bridges require "tokens" as well.

Yes. Most of the currently existing ones. They do that to ensure a data-source 
cluster state proof is generated correctly, by someone trustful, and submitted 
often enough to the recipient cluster. "Often enough" requirement raises from
the proof generation complexity - it means proof generating relay cluster members 
are required to have some hardware of a good performance (often with top-grade 
GPUs or even FPGAs) to be able to produce such state proofs. And such a hardware 
needs to be paid for. So this leads to the necessity to incentivize proofs 
generating members.

There also surely are in-EVM state proof verification costs, which traditional 
approach supposed to be paid by this set of incentivized members.

So, here we go. Expensive proof generation and verification along with state 
proof consistency maintenance necessity leads to the incentivization.

Making Solana state proof generation and verification less 
complex (and therefore cheaper) paves the way to removing the necessity of having 
a group of proof generating servers, so it removes the need to incentivize them, 
so it removes the need for a so-called "token".

## Okay. How in particular?

1. Solana state which is being made in-EVM-verifiable is a ["light
client"](https://docs.solana.com/proposals/simple-payment-and-state-verification#light-clients) 
state. A "light client" provides a level of security greater than trusting a 
remote validator, without requiring the light client to spend a lot of resources 
verifying the ledger. It also provides a state much smaller, containing
validator votes, their stakes and transaction inclusion proofs (more precise
description of a "light-client" data structure is present in here: https://docs.solana.com/proposals/simple-payment-and-state-verification#light-clients). This means there is no need to verify the whole 
Solana database, but just a crucial piece of it. This already reduces the circuit
size greatly. This reduces the proof generation and verification time.

2. To reduce the amount of computations required for proof 
generation/verification, it is required to reduce the amount of constraints/gates 
generated by the proof system itself. That is why the proof system selected for the 
"light-client" state proof generation is a PLONK-based one In comparison to more 
usual R1CS-based ones, PLONK-based schemes provide [up to 5x constraints/gates reduction](https://docs.zkproof.org/pages/standards/accepted-workshop3/proposal-turbo_plonk.pdf).

> Though, the amount of constraints is not the only factor affecting the resulting
> provable data size. Commitment scheme is what defines the actual size of the
> data after its conversion to the set of constraints is completed. It also
> affects the proof generation and verification computations complexity, and that
> means the balance between proof generation time and proof verification time has
> to be found.
>
> The best verification complexity for PLONK-based schemes known out there is a 
> constant-time complexity with Kate commitment scheme. The problem about it is 
> that it does not result in a transparent SNARK, which means it requires a
> trusted setup procedure. This makes the whole proof verification idea crooked. 

> Better solution with transparent properties is provided by RedShift
> construction, which adjusts the FRI commitment scheme to PLONK-syntaxed schemes 
> usage, introducing the LPC commitment scheme, and allows to verify the proof in 
> less than $21 \times log2(n)$ time and generate the proof in less than 
> $54(n + a)log2(n + a)$ time depending on the amount of PLONK rows.


Such proof generation/verification cheapening measures lead to anyone wanting to
put some data batch through the bridge can generate Solana state proof
themselves, submit it and (along with some additional proof submitted) put the
data through the bridge safely.

To guarantee the safety of such a use case, more strict requirements were introduced 
for the in-EVM proof submission and verification mechanism.

## Which requirements?

Since the set of trusted parties generating and submitting the Solana's "light
client" state proof to EVM-enabled cluster from time to time is not supposed to 
be present within the architecture described, there is a need for a way to keep 
track of such a sequence of proofs, stored inside Ethereum, to be a valid one,
without any malicious party to be able to submit a faulty state proof. A state
proof from some other, blank Solana cluster, for example.

So the requirements introduced make the in-EVM verificator to check if the state
proof is derived from the previous one, which is derived from a previous one,
which is derived from a previous one and so on.

Sounds like a usecase for a recursive SNARK, you say? Well, something like that.

> In particular, the state proof sequence maintenance mechanism is defined as
> follows: 
> Let $B_{n_1}$ is the last state confirmed on Ethereum.
> The prover wants to confirm a new $B_{n_2}$ state. 
> Denote by $H_{B}$ the hash of a state $B$.
> The proving statement contains (but not bounded by) the following points:
>
>  1. Show that the validator set is correct.  
>  2. Show that the $B_{n_1}$ corresponds to the last confirmed state on Ethereum.  
>  3. for $i$ from the interval $[n_1 + 1, n_2 - 1]$:  
>      1. Show that $B_{i}$ contains $H_{B_{i - 1}}$ as a hash of the previous state.  
>  4. for $i$ from the interval $[n_2, n_2 + 32]$:  
>      1. Show that $B_{i}$ contains $H_{B_{i - 1}}$ as a hash of the previous state.  
>      2. Show that there are enough valid signatures from the current validator set for $B_{i}$.  
>  5. Build a Merkle Tree $T_{n_1, n_2}$ from the set $\{H_{B_{n_1}}, ..., H_{B_{n_2}}\}$.  
>
> $T_{n_1, n_2}$ allows to provide a successfull transaction from $\{B_{n_1}, ..., B_{n_2}\}$ to the Ethereum-based proof verificator later. 


## But what about validator set correctness?

There are considerations regarding that as well.

The best way to prove that the validator set from some Solana epoch is derived and
consistent with the previous one, is "anchor" transactions. It is the transaction 
that checks the validator's account state. The prover needs to send such 
transactions periodically at the end of epochs. It allows decreasing the 
number of blocks between the last known account state and the new epoch.

> But, in case such a transaction type will not be introduced in Solana, there is
> one more way.
> Let $E_1$, $E_2$ are two consecutive epochs. $E_1$ is confirmed on the Ethereum side and $E_2$ is not.
> 
> To prove the validator set $S_2$ of $E_2$, the prover does the following:
> 1. for $i$ from ${v_1, ..., v_m} = S$:
>     1. Show the inclusion proof of the last stake-change transaction to $v_i$ (no later than the end of $E_1$).
>     2. Show that there wasn't any stake update since the last delegate transaction $tx_{last}$.
>        That means verifying all transactions between $tx_{last}$ and the beginning of $E_2$.
> 
> Such an approach provides additional overhead to the prover.
> The proof of correct validator set will be simplified after implementation of the "Simple Payment and State Verification (https://docs.solana.com/proposals/simple-payment-and-state-verification) proposal.

## Okay, how much for a single bridged transaction?

Well, let us calculate that roughly.

### Ed25519 Verification

Validator votes in Solana are represented by their Ed25519 signatures. EdDSA signature verification requires $1$ fixed base scalar multiplication and $2$ variable base scalar multiplication. Additionaly, it requires SHA2-512 computation (for each signature).

According to [https://zcash.github.io/orchard/design/circuit/gadgets/ecc.html](https://zcash.github.io/orchard/design/circuit/gadgets/ecc.html):
1. Fixed base scalar multiplication takes $f = 255/6$ gates.
2. Variable base scalar multiplication takes $v = 255/2$ gates. 

SHA2-512 can be computed under PLONK within $\approx20000$ gates.

> More precise signatures verification generates $n_{rows-1} = N_{sig} \cdot (f + 2 \cdot v + H)$ rows.  
> Here $H$ is the amount of rows used by hash function (SHA256), $N_{sig}$ is the amount of signature. 

### Hash Chain and Merkle Tree Verification

> According to the state sequence maintenance algorithm, there are 
> $n_{rows-2} = 2 \cdot (n_2 - n_1) \cdot H_{sha256} + \log(n_2 - n_1) \cdot H_{sha256} $ 
> additional rows for hash chain and Merkle tree calculations. 
> For simplicity, we use SHA256 hash function for $T_{n_1, n_2}$ but it can be 
> changed to Poseidon. 

### Overall Costs

The main verifier's costs are Merkle proof verification ($\log^2n + 2 \cdot \log 2 n)$) and low-degree testing ($\log n$), where $n$ is commited polynomial's degree ($n = \text{rows} \cdot (\text{wires} + 1)$). For simplicity, only lead costs are considered for low degree tests that is two inversion over finite field ($\approx30000$ gas). Keccak256 costs 30 gas. 

> In particular:
> 
> $n_{rows} = n_{rows-1} + n_{rows_h}$  
> $n = n_{rows} \cdot (n_{wires} + 1)$  
> $gas = (\log^2n + 2 \cdot \log 2 n) \cdot 30 + \log n \cdot 30000$  
> 
> where  $n_{wires}$ is the amount of wires in the Turbo PLONK gate.
> 
> For $n_2 - n_1 = 1000$ and $32000$ signatures verification (finalization block check): 
> * $n_{rows} =  669\,667\,657$
> * verification gas costs: $2\,014\,200$

So. The answer is $2\,014\,200$ gas per state proof verification roughly and 
pessimistically.

## Can we do that cheaper?

Well, there is a thing to try, yes. To decrease the size of the proof and verification costs, it is possible to add one more proof layer. RedShift proof can be verified by another RedShift instance. For circuits of a significant size (as the one described above), additional wrapping the original proof into the "proof of correct proof of knowledge" decreases verification costs. 

> Poseidon hash function generates $\approx1000$ gates.
> For $n_{rows} = 669\,667\,657$, $\approx4560$ hash verification is required that is the lead cost of the verification circuit. 
> Thus, for $n_2 - n_1 = 1000$ and $32000$ signatures verification: 
> * $n_{rows} =  4\,560\,000$
> * verification gas costs: $1\,580\,970$
>
> With such a trick applied, proof size results in $\approx100$KB.
>
> Note that verification costs grow logarithmicaly with $n_2 - n_1$ value. 

## Okay. Any problems with the mechanism? 

Yes. There are some. When using a bridge built upon such a state proof verification mechanism, one should be aware that the first version of the mechanism described is supposed to prove the state of the latest optimistically-confirmed replication packet the "light-client" received. That means, in case Solana cluster fails to confirm its optimistically-selected replication packet as a "final" one, state proof sequence will require re-generation. This means whatever optimistically confirmed data was rejected in Solana cluster, will be rejected in the same time within the in-EVM proof sequence.

Such an issue is induced by Solana architecture. It supposes the latest replication packet received by the "light client" to be an "optimistically confirmed" one, and in case proof generation process results with the wrong proof as the result, this would be a Solana's "light client" by-design "issue".

### So. Be careful.

## Got it. When?

The detailed design description along with some prototypes are supposed to be ready in Q4 2021. Production-ready implementation is supposed to be done 'till the end of Q1 2022.