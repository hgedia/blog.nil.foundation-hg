---
title: Mina-Ethereum State Proof Verification Applications.
layout: post
date: 2021-11-01
excerpt: How would an in-EVM Mina state verification-based bridge work? 
author: Mikhail Komarov
tags: crypto3 mina
comments: false
---

## Introduction

This is the second post within the series of Mina-Ethereum bridge-dedicated blog posts of ours. 
The first one is in [here](https://blog.nil.foundation/2021/09/30/mina-ethereum-bridge.html).

This time a description of how a Mina-Ethereum bridging application based on the 
in-EVM state proof verification of ours would work.

## Didn't you post such a description already?

Not really. What we do is not the bridge itself, but a core mechanism, a crucial 
component to achieving such a bridging. Mina state verification on Ethereum. This 
will not bring the bridge functionality out of the box, but with proper applications 
on top of it, this can be used to build such a functionality.

## Which applications?

Yeah. That is what I was about to tell.

Let us consider a hypothetical Mina-Ethereum bridge based on a state proof 
verification mechanism. What would it consist of?

Well, first of all, we gotta make sure that whatever happens in Mina can be proved 
to be valid on Ethereum. This can be done as follows:

1. Retrieve Mina state proof.
2. Put it onto Ethereum.
3. Ethereum checks if the state proof is valid.
4. Ethereum accepts and stores the proof in case it is valid and rejects otherwise.

Notice that there are no incentivized protocol participants which prove the state 
proof is valid. As there are no incentives at all. This means it is completely 
trustless.

## Why is it so?

Mina's state proof is self-validatable. Even in case a non-valid proof gets 
generated and submitted to Ethereum side, it will simply not pass the verification.

Better news is that the typical application using such a core internally
wouldn't need a state proof from every user, but at least from a single one. So
it is enough for at least one user to submit the proof for the verification and
all the others willing to prove the data which newly submitted proof contains, 
are good to go for free (in terms of paying the verification cost).

## The most trivial application case. WMINA.

Now lets consider the most trivial case this can be used for. 
Wrapped Mina on Ethereum. Or, how they usually call this kind of things - WMINA.

This would require implementing the in-EVM logic, which would issue WMINA according 
to the amount which was transferred on Mina side and that was verified to be true by
state proof verification mechanism.

So the overall workflow now looks like this:

1. Retrieve Mina state proof.
2. Put it onto Ethereum.
3. Ethereum checks if the state proof is valid.
4. Ethereum accepts and stores the proof in case it is valid and rejects otherwise.
5. Submit the amount of MINA on Mina side which should be transferred the in-EVM application.
6. In-EVM application issues the amount of WMINA which was proved to be truly
   submitted.

## What about something less trivial?

This can actually be generalized to proving various computations, done with
Snapps on the Mina side, on Ethereum. The overall process is still going to be the
same, the only thing which should be different is what in particular the in-EVM 
part does.

Proving that a particular trade order was filled on Uniswap with Mina without 
revealing the actual trade? Yes.

Proving the location with Mina with some transfer happening on Ethereum afterward? 
Yes.

Proving the identity with Mina and using it as a second factor to the Ethereum-based 
action authorization? Yes.

Lots of things can be brought in here. You name it.

## Who is going to submit those proofs to Ethereum?

Any user or application which is about to use the bridge. Since Mina state proof can be 
self-verified, there is no need to keep any set of trusted protocol participants 
to submit those proofs periodically. And, since the state proof verification is
pretty cheap as well, there will be no significant overhead in Mina-Ethereum 
transaction cost.

Important nuance is that it is enough to submit only one valid proof of a particular
Mina's state to make all the applications using such a state proof verification 
core to be able to function. So, in the end, only one user (the least lucky one) 
will pay the verification cost to Ethereum, others will be able to re-use Mina's 
state proof once verified for free.

## Alright. Is there anything to try already?

Yes. We do have a work-in-progress interactive state proof preprocessing demo.
Kind of a walkthrough those crucial 4 steps (state proof verification) of every
bridge application there will be.

It is being prepared at [https://verify.mina.nil.foundation](https://verify.mina.nil.foundation).

## A browser? Don't I need Mina and Ethereum nodes to do that?

No. The only thing you need is Mina's state proof (which, thanks to 
[Chainsafe's Mina protocol implementation](https://github.com/ChainSafe/mina-rs) 
is going to be possible to be retrieved right in the browser as well) and
Ethereum RPC client library (there are plenty of those which run right inside the
browser as well), connecting to any Ethereum node (even untrusted public one would work).

So. In the end. The only thing you (and anyone at all) need is your browser.

This means such a bridge could be introduced not only to mobile and
desktop-based wallet applications, but to any web-based wallet (Metamask,
anyone?) as well.

## Any updates regarding finalization timings?

Timings are still pretty much the same. Q1 2022 will bring the production-ready
version. The end of November 2021 have brought detailed design architecture description ([https://github.com/NilFoundation/evm-mina-verification/blob/master/docs/design/main.pdf](https://github.com/NilFoundation/evm-mina-verification/blob/master/docs/design/main.pdf)).

Stay tuned!
