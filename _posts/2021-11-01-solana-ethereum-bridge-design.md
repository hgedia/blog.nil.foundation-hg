---
title: Solana-Ethereum Bridge Based on Light-Client State Proof Verification.
layout: post
date: 2021-11-01
excerpt: How would a bridge built on top of that work?
author: Mikhail Komarov
tags: crypto3 solana 
comments: false
---

## Introduction

This is the second post within the series of Solana-Ethereum bridge-dedicated blog posts of ours. 
The first one is in [here](https://blog.nil.foundation/2021/10/14/solana-ethereum-bridge.html).

## Hi! I'm 5yo and I eat glue. Explain to me how this bridge of yours works?

Hello, fellow glue eater! ELI5 is not something we do usually but this time we
will try. So lets get to it.

First thing first. The project we do is not the bridge itself in terms of how
people commonly think of bridges. It is a core to the bridge (first completely
trustless bridge, by the way). A Solana's 'Light-Client' state verification protocol. 
So you wouldn't be able to "transfer tokens" out of the box, but applications 
developers who will build the exchange (or something more interesting - why not?)
on top of such a state proof verification mechanism, making this possible, are 
warmly welcomed.

## Ah. Yeah... Applications... Developers...

Every application using such a verification mechanism is going to have 4 steps 
in its core.

1. Retrieving Solana's 'Light-Client' state.
2. Generating a state proof.
3. Putting it to Ethereum (or any other EVM-enabled cluster) for it to check the
   newly generated state proof validity.
4. Ethereum accepts the state proof and marks it as a valid one (without storing
   it internally).

First step would require Solana's RPC endpoint to be available, but it shouldn't
be a trusted one. Any would work. Even a public one.

Second step. Proof generation. From an engineering point of view, you can think of
this process as of a one-way compression preserving internal data structure
knowledge. In fact, certainly, it is more than that (and the compression is
actually the wrong word for it), but, well, we're doing an ELI5 blog post, right?

This step would require any device which can process basic arithmetics. A
laptop? Yes. A phone? Yes. Web browser? Yes.

Third step. Submitting the state proof for the verification to Ethereum. Since
the state proof generated is not of a recursive nature (its verification doesn't 
verify all the previous state proofs submitted), it is required to maintain the
sequence of proofs on EVM-enabled cluster. Such a sequence originates from the
very first Solana's state (people call it, ugh, "genesis") and validates that
the proof was generated from a proper Solana's cluster, but not from some empty
one. But all this gets handled by in-EVM logic, so from the application
developer's point of view, the only thing which is required is to submit the
proof to some Ethereum RPC endpoint (works from a browser as well).

Fourth step. This step actually does what just've been described. On this stage
the only thing a user or an application developer can do is to relax and wait
for things to happen. A web browser could be useful for that as well. Helps to 
pass the time, those several seconds, while verification is being performed.

After these 4 steps we have a valid representation of Solana's 'Light-Client'
state on Ethereum.

## You're explicitly indicating a web browser everywhere. Why is it so?

Because, according to the process described above, the only thing you need to
bridge two clusters is a web browser. No "relays", no "tokens", no "validators", 
nothing. Just a web browser.

We're even (secretly) proud of how redundant and obsolete this makes those bulky 
"relay"-based bridges look like (Wormhole, anyone?).

## Yeah yeah, don't brag about it. It is not done yet.

Fair enough.

## What about application examples?

Let us consider the most trivial one. "Token bridge". What would it require?

Well, first of all, it would require those 4 core steps we were talking
about earlier:

1. Retrieving Solana's 'Light-Client' state.
2. Generating a state proof.
3. Putting it to Ethereum (or any other EVM-enabled cluster) for it to check the
   newly generated state proof validity.
4. Ethereum accepts the state proof and marks it as a valid one (without storing
   it internally).

Next the application logic comes in. On Solana's side it would be required to at
first "lock" the "asset" bridged.

Then, since Solana's 'Light-Client' state is supposed to contain the information
about current cluster members only (people call them "validators", ugh), it is 
required to retrieve the particular transaction you are trying to bridge and
generate an additional proof for it. Since a single Solana's transaction is
limited by 1232 bytes, this shouldn't create any troubles with proof generation.

The In-EVM side of the application is supposed to check the validity of the transaction 
(if it actually exists on Solana's side) by comparing it with Solana's Merkle 
hashes submitted and proved on Ethereum side by the state proof validation process.

Then the in-EVM application part is supposed to issue the bridged asset on
Ethereum side.

Voila. Completely trustless, "token"-less, "relay"-less, "validator"-less
(shitless, huh?) bridge. Relies on cryptographic assumptions only, but not on
game-theoretic (i.e. financial in the end) ones.

## Why you are putting these quotes everywhere?

Ah. This is a topic for a separate conversation (or a blog post). You will start 
putting those quotes everywhere after it as well.

## How about trying something out? A demo?

There is a work-in-progress demo version (very drafty one, will post every time 
there is a major update regarding this demo) at 
[https://verify.solana.nil.foundation](https://verify.solana.nil.foundation). 
It allows you to get a general feeling of those 4 core steps. They are supposed to 
be done automatically in actual applications, but for now they matter.

In case you're in for deep technical details, you can consider reading the paper
describing bridge proof system and its' circuit PLONK gates in here: 
[https://github.com/NilFoundation/evm-solana-verification/blob/master/docs/design/main.pdf](https://github.com/NilFoundation/evm-solana-verification/blob/master/docs/design/main.pdf).

In case you're ready to dive into the code, you're welcome to the repository of
ours: [https://github.com/NilFoundation/evm-solana-verification](https://github.com/NilFoundation/evm-solana-verification).

## A typical question in the end. Timings?

Still the same. The design is already in (at least for the most critical parts -
proof system)([https://github.com/NilFoundation/evm-solana-verification/blob/master/docs/design/main.pdf](https://github.com/NilFoundation/evm-solana-verification/blob/master/docs/design/main.pdf)).

Next step - a proof generation process demo. In-browser one surely.

Stay tuned!
