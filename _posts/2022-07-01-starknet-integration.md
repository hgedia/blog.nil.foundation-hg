---
title: Bridging to StarkNet through <span style='font-family:Menlo, Courier, monospace'>=nil;</span>.
layout: post
date: 2022-07-01
excerpt: Starting with bridging Solana to StarkNet through <span style='font-family:Menlo, Courier, monospace'>=nil;</span>.
author: Mikhail Komarov <br> Special thanks to Ohad Barta, Nitzan Grossman and StarkWare fellows in general for discussion, adjustments and comments.
tags: dbms io starknet solana
comments: false
---

## What is this about?

This post covers one of the applications of a 
[<span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span>](https://blog.nil.foundation/2021/12/01/database-management-system.html)-based 
[Trustless Data Accessibility protocol](https://blog.nil.foundation/2022/05/31/dbms-replication-protocol.html) - 
trustless bridging. In particular, it covers what [StarkNet](https://starknet.io) users 
could gain from retrieving proofs of various protocols.

## Wait, what?

That is right. Remember our [Data Accessibility protocol](https://blog.nil.foundation/2022/05/31/dbms-replication-protocol.html) announcement? The one which is which supposed to be capable to provide 
trustless I/O to various databases through the DBMS query language unified for all 
the databases (Bitcoin, Ethereum, Solana, Mina, others).

> In particular, =nil; Proof Market extension provides users (no matter what kind of users - 
> applications or protocols) with on-demand state and query proofs for three different 
> use cases:
> 1. **Trustless Data Access.** If a proof consumer is an end-user application or 
>    a frontend of any kind, it could be used for accessing data on the protocol 
>    that it lives on.
> 2. **Trustless Bridging.** If a proof consumer is a protocol (e.g. Mina), and a 
>    user of this protocol requested a state/query proof of another protocol 
>    (e.g. Ethereum or Solana), it could be used for trustless bridging of these 
>    two protocols.
> 3. **Pluggable Scaling.** If a proof consumer is a protocol and its user (an 
>    application or otherwise) it is of the same kind a user has requested a 
>    state/query proof from (e.g. some Avalanche user has requested a state/query 
>    proof of another independent, application-specific Avalanche deployment), then 
>    it results into increasing the throughput of the original protocol cluster 
>    deployment.

And! StarkNet integration leverages the second use case - trustless bridging.

## Bridging to what? StarkNet is so-called "L2" to Ethereum's database.

That is true. And, this Ethereum L2 could use some data from other protocols in
the same way as actual Ethereum's users - through 
[<span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span>](https://blog.nil.foundation/2021/12/01/database-management-system.html) and [Data Accessibility protocol](https://blog.nil.foundation/2022/05/31/dbms-replication-protocol.html).

That means, we're talking about bridging third-party protocols TO StarkNet.

## Okay. How?

Recently StarkWare [started](https://twitter.com/starkwareltd/status/1539632751527198720?s=21&t=jcrqC8Y1QqyQ91dFVbY0-w) 
[pushing forward](https://medium.com/starkware/fractal-scaling-from-l2-to-l3-7fe238ecfb4f) 
the idea of using STARK recursion for achieving more scalability to StarkNet. 
It was called an "L3" concept. So-called "L3" concept supposes for independent 
StarkNet instances (any Cairo-generated logic to be precise) to bring their state 
proofs to StarkNet, making it possible to verify themselves in StarkNet.

> In particular StarkWare supposes for Cairo/StarkNet to gain STARK
> verification Cairo-based logic, so Cairo-generated STARK proofs could be verified
> within StarkNet. 
>
> And, of course, I gotta admit that Cairo postprocessing output have almost 
> nothing to do with legacy STARK proofs because Cairo compilation output is
> more of a public assignment to STARK proof generator. That means, yeah, we're
> talking only about getting independent StarkNet instances verified on
> StarkNet.

In the same time, trustless bridging use case of 
[<span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span>](https://blog.nil.foundation/2021/12/01/database-management-system.html)-based [Data Accessibility protocol](https://blog.nil.foundation/2022/05/31/dbms-replication-protocol.html) supposes for various protocols state proofs to be generated in Placeholder 
proof system and ordered by whoever needs them for whatever use case.

## So what? It is a different proof system. Seems to be unrelated.

Not so fast. Remember our integration with Mina Protocol? The one for which we've 
introduced a trick with wrapping the proof verification in another proof. 

> Let’s briefly remind you about that.
> Mina Protocol has its state proof generated in Kimchi proof system. 
> Since strainghtforward Kimchi proof verification on EVM is too expensive, 
> we basically have to to wrap Kimchi proof verification algorithm in another 
> proof (using =nil;’s Placeholder proof system), and create a ‘proof of a 
> successful verification’ - this can then be cheaply verified within the EVM.
>
> So the current step by step process is as follows:
> 1. Mina's native state proof gets retrieved
> 2. Auxiliary proof in Placeholder proof system is being generated
> 3. Auxiliary proof is being submitted to EVM for the verification to happen

> More detailed overview of a currently existing solution can be found in previous 
> relevant blog posts: [https://blog.nil.foundation/2021/11/01/mina-ethereum-bridge-design.html](https://blog.nil.foundation/2021/11/01/mina-ethereum-bridge-design.html), 
> [https://blog.nil.foundation/2021/09/30/mina-ethereum-bridge.html](https://blog.nil.foundation/2021/09/30/mina-ethereum-bridge.html).

So, the same trick we apply to StarkNet. Whatever protocol's (like Solana's or
Avalanche's) state/query proof is being generated with our [Data Accessibility protocol](https://blog.nil.foundation/2022/05/31/dbms-replication-protocol.html), we can wrap its verification 
into Cairo-compatible STARK proof. 

And that would result into...

## Trustless bridging to StarkNet!

That is right.

Let’s break this process down step-by-step.

1. First of all, we need a state proof for the third-party protocol we want to 
   bridge to StarkNet, generated in the Placeholder proof system, and wrapped 
   in a Cario-compatible STARK proof. Let’s say this third-party protocol is Solana 
   (but in reality, it could be any protocol supported by <span style='font-family:Menlo, Courier, monospace'>=nil;</span>). 
   So the user or application wanting to bridge Solana's data to StarkNet has to 
   retrieve this proof from <span style='font-family:Menlo, Courier, monospace'>=nil;</span>.
2. Then it is required submit the retrieved proof to Cairo's STARK proof verifier. 
   From StarkNet’s perspective, a <span style='font-family:Menlo, Courier, monospace'>=nil;</span>-generated 
   data proof will be identical to the natively generated Cairo-based proof.
3. After the proof is submitted to StarkNet in-Cairo proof verifier, the user 
   (or StarkNet-based application) receives the relevant Solana's data - and 
   voila! Solana's data is being safely and trustlessly used in StarkNet.

![](/assets/images/2022-07-01-starknet-integration/сase1.png)

## But this mechanism was supposed to be used for so-called "L3"s...

Again. That is right. But! Who said we cannot exploit such a concept in a wrong
way bringing some additional capabilities to StarkNet through <span style='font-family:Menlo, Courier, monospace'>=nil;</span>?

In particular, StarkWare's vision on so-called "L3" concept is pretty much
described as a set of independent StarkNet instances bringing themselves to the
actual L2 StarkNet.

But, funny fact is, <span style='font-family:Menlo, Courier, monospace'>=nil;</span> binds this concept over by vanishing the difference 
between L1s and L3s by litreally binding over various L1s to become L3s.

**So funny thing is that every L1 now becomes an L3 through <span style='font-family:Menlo, Courier, monospace'>=nil;</span>**.

## What about other protocols?

Other protocols, supported by <span style='font-family:Menlo, Courier, monospace'>=nil;</span> 
are also going to be available for StarkNet-compatible state/query proof generation 
and retrieval. For example, Solana's integration is on its way.

## Stay tuned!
