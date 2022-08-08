---
title: Bridging Mina with <span style='font-family:Menlo, Courier, monospace'>=nil;</span>.
layout: post
date: 2022-06-28
excerpt: How will a Mina Protocol's bridge become bi-directional?
author: Mikhail Komarov, Aleksey Sofronov <br> Special thanks to Luke Pearson for discussion, adjustments and comments.
tags: dbms io mina
comments: false
---

## What is this about?

This post covers one of the applications of a [=nil; 'DROP DATABASE *](https://blog.nil.foundation/2021/12/01/database-management-system.html)-based [Trustless Data Accessibility protocol](https://blog.nil.foundation/2022/05/31/dbms-replication-protocol.html) - trustless bridging. In particular, it covers an integration with 
[Mina Protocol](https://minaprotocol.com), for which we've already 
[described](https://blog.nil.foundation/2021/09/30/mina-ethereum-bridge.html), 
[developed](https://blog.nil.foundation/2021/11/01/mina-ethereum-bridge-design.html) 
and [demoed](https://twitter.com/nil_foundation/status/1519217326679277569?s=21&t=cO_rYkedp2iIoekhh9DbQg) 
a one-directional bridge.

## Alright. Let's read your story.

In the end of April 2022 Mina Protocol's in-EVM state verification finally saw
the light of the day [https://verify.mina.nil.foundation](https://verify.mina.nil.foundation).
Meanwhile, <span style='font-family:Menlo, Courier, monospace'>=nil;</span> 
Foundation wasn't sitting idle and 
[announced](https://blog.nil.foundation/2021/12/01/database-management-system.html) 
a <span style='font-family:Menlo, Courier, monospace'>=nil;</span> Database Management System 
called <span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span> 
and [its replication protocol extension](https://blog.nil.foundation/2022/05/31/dbms-replication-protocol.html) 
which is capable of providing trustless I/O to various databases through the DBMS's 
query language unified for all the databases (Bitcoin, Ethereum, Solana, Mina,
others).

## And how is this relevant?

=nil; provides users (no matter what kind of users - 
applications or protocols) with on-demand state and query proofs for three different 
use cases:
1. **Trustless Data Access.** If a proof consumer is an end-user application or 
   a frontend of any kind, it could be used for accessing data on the protocol 
   that it lives on.
2. **Trustless Bridging.** If a proof consumer is a protocol (e.g. Mina), and a 
   user of this protocol requested a state/query proof of another protocol 
   (e.g. Ethereum or Solana), it could be used for trustless bridging of these 
   two protocols.
3. **Pluggable Scaling.** If a proof consumer is a protocol and its user (an 
   application or otherwise) it is of the same kind a user has requested a 
   state/query proof from (e.g. some Avalanche user has requested a state/query 
   proof of another independent, application-specific Avalanche deployment), then 
   it results into increasing the throughput of the original protocol cluster 
   deployment.

In this article, we’ll be describing the second use case applied to Mina.

## Okay. Haven’t you already done this? What’s so new about it?

Not so fast. What we’ve accomplished so far is a one-directional Mina-Ethereum 
bridge core (which is effectively an in-EVM Mina state transition verification).

> Let’s briefly walk through the current design
> Since strainghtforward Kimchi proof verification on EVM is too expensive, 
> we basically have to to wrap Kimchi proof verification algorithm in another 
> proof (using <span style='font-family:Menlo, Courier, monospace'>=nil;</span>’s 
> Placeholder proof system), and create a ‘proof of a successful verification’ - this 
> can then be cheaply verified within the EVM.
>
> So the current step by step process is as follows:
> 1. Mina's native state proof gets retrieved
> 2. Auxiliary proof in Placeholder proof system is being generated
> 3. Auxiliary proof is being submitted to EVM for the verification to happen

Application examples of a currently existing single-directional in-EVM Kimchi 
proof verification are:
1. Proving that a particular trade order was filled on Uniswap with Mina without revealing the actual trade
2. Proving the location with Mina with some transfer happening on Ethereum afterward
3. Proving the identity with Mina and using it as a second factor to the Ethereum-based action authorization
4. Others, you name it.

More detailed overview of a currently existing solution can be found in previous 
relevant blog posts: [https://blog.nil.foundation/2021/11/01/mina-ethereum-bridge-design.html](https://blog.nil.foundation/2021/11/01/mina-ethereum-bridge-design.html), 
[https://blog.nil.foundation/2021/09/30/mina-ethereum-bridge.html](https://blog.nil.foundation/2021/09/30/mina-ethereum-bridge.html).

The most important thing that the =nil; brings is the capability to fetch 
state and query proofs for various other protocols (like Ethereum, Solana or 
Avalance). And, since we can switch the proof system being used within 
<span style='font-family:Menlo, Courier, monospace'>=nil;</span>, those query 
and state proofs can be bridged to any supported proof system. In Mina’s case 
specifically, we generate the proofs in Kimchi.

> To be more presice we have a couple of options how to arrange this:
> 1. Reconstruct the query/state proof directly in Kimchi, which would look 
>    something like this: the user constructs a query (such as 
>    _db["eth"].select("accounts").where("key").equals("name").and("value").equals("100")) 
>    and this would return a Kimchi proof, ready to be verified on Mina right away.
>
>    The downside of this approach is that proof generation will become much more 
>    expensive, because of the need to reconstruct the original proof in Kimchi - 
>    essentially incurring a linear double cost for each query.
>
> 2. Wrap’ the state/query proof (generated with the Placeholder proof system) 
>    by implementing the verification algorithm as a Kimchi circuit. This would 
>    also incur an additional proof generation for each query, but will generally 
>    be much cheaper as this circuit is constant-size, and avoids naively 
>    duplicating the original proof.
>
>    At a glance, the second option seems to be more viable.

This specification allows us to verify third-party protocol data proofs directly 
within Mina, which leads us to...

## Mina Bi-Directional Bridging!

Yes!

Let’s break this process down step-by-step.

1. First of all, we need a state proof for the third-party protocol we want to 
   bridge to Mina, generated in the Placeholder proof system, and wrapped 
   in a Kimchi proof. Let’s say this third-party protocol is Ethereum (but in 
   reality, it could be any protocol supported by 
   <span style='font-family:Menlo, Courier, monospace'>=nil;</span>). So the user or 
   application wanting to bridge Ethereum data to Mina has to retrieve this proof 
   from <span style='font-family:Menlo, Courier, monospace'>=nil;</span>.
2. Next, submit the retrieved proof to the Mina verifier. From Mina’s perspective, 
   a <span style='font-family:Menlo, Courier, monospace'>=nil;</span>-generated 
   data proof will be identical to a native Mina's zkApp-generated proof. 
   A <span style='font-family:Menlo, Courier, monospace'>=nil;</span>-flavored 
   Mina's zkApp, if you will.
3. After the proof is submitted to the Mina verifier, the user (or Mina-based 
   application) receives the relevant Ethereum data - and voila! Ethereum's data 
   is being safely and trustlessly used in Mina.

![](/assets/images/2022-06-01-mina-integration/case1.png)

## What about other protocols?

Other protocols, supported by <span style='font-family:Menlo, Courier, monospace'>=nil;</span> 
are also going to be available for Mina-compatible state/query proof generation 
and retrieval. For example, Solana's integration is on its way.

Same process as for Ethereum from user story side:
1. Retrieve a state/query proof with Solana's data generated with Placeholder 
   and wrapped with Kimchi proof system from <span style='font-family:Menlo, Courier, monospace'>=nil;</span>.
2. Submit such a proof to Mina's native verifier just like you would do with a
   Snapp's proof.
3. Feel free and safe to use Solana's data within the Snapp.

## And a data proof from a combination of protocols?

Yes! It is a DBMS which supplies <span style='font-family:Menlo, Courier, monospace'>=nil;</span> 
with data, remember?

So, in case a user wants to bridge Solana's and Ethereum, the only adjustment to
the user story would be to retrieve a proof of a composite query from 
<span style='font-family:Menlo, Courier, monospace'>=nil;</span> with something 
like: `SELECT FROM SOLANA WHERE a EQUALS b; SELECT FROM ETHEREUM WHERE
c EQUALS d`. Then <span style='font-family:Menlo, Courier, monospace'>=nil;</span> 
would return a proof of such a query generated in Placeholder proof system and 
wrapped with Kimchi, which will be okay for Mina's native verifier, so one can 
safely use other protocols data in Mina.

## Sold. When?

According to our best estimates, we plan to introduce the first working prototype 
of Ethereum’s state/query proof generator compatible with Mina’s proof system in 
Q4 2022.

## Stay tuned!
