---
title: Bridging Mina with =nil; 'DROP DATABASE *'s Replication Protocol Trustless I/O Extension.
layout: post
date: 2022-06-28
excerpt: How will a Mina Protocol's bridge become bi-directional?
author: Mikhail Komarov, Alexey Sofronov
tags: dbms io mina
comments: false
---

## What is this about?

This post covers one of the applications of a [=nil; 'DROP DATABASE *](https://blog.nil.foundation/2021/12/01/database-management-system.html)'s replication protocol [trustless I/O extension](https://blog.nil.foundation/2022/05/31/dbms-replication-protocol.html) - trustless bridging. In particular, it covers an integration with [Mina Protocol](https://minaprotocol.com), which 
single-directional Ethereum corner case integration was already described 
([https://blog.nil.foundation/2021/09/30/mina-ethereum-bridge.html](https://blog.nil.foundation/2021/09/30/mina-ethereum-bridge.html)), developed ([https://blog.nil.foundation/2021/11/01/mina-ethereum-bridge-design.html](https://blog.nil.foundation/2021/11/01/mina-ethereum-bridge-design.html)) and demoed 
([https://twitter.com/nil_foundation/status/1519217326679277569?s=21&t=cO_rYkedp2iIoekhh9DbQg](https://twitter.com/nil_foundation/status/1519217326679277569?s=21&t=cO_rYkedp2iIoekhh9DbQg)).

## Alright. Let's read your story.

In the end of April 2022 Mina Protocol's in-EVM state verification finally saw
the light of the day [https://verify.mina.nil.foundation](https://verify.mina.nil.foundation).
Meanwhile, =nil; Foundation wasn't sitting idle and [announced](https://blog.nil.foundation/2021/12/01/database-management-system.html) a =nil; Database Management System called =nil; 'DROP DATABASE * and [its 
replication protocol extension](https://blog.nil.foundation/2022/05/31/dbms-replication-protocol.html) 
which is capable of providing trustless I/O to various databases through the DBMS 
query language unified for all the databases (Bitcoin, Ethereum, Solana, Mina,
others).

## And how these things are relevant?

=nil; 'DROP DATABASE *'s replication protocol trustless I/O extension provides
users (no matter what kind of users - applications or protocols) with state and
query proofs for three different use cases:
1. **Trustless Data Access.** In case a state/query proof consumer is an end-user application or a
   frontend of any kind, this use case results into 
2. **Trustless Bridging.** In case a state/query proof consumer is a protocol
   (e.g. Mina) and a user of such a protocol requested a state/query proof of
   another protocol of a different kind (e.g. Ethereum or Solana), this results 
   into a trustless bridging of these two protocols involved (e.g. Mina and Ethereum).
3. **Pluggable Scaling.** In case a state/query proof consumer is a protocol and its 
   user (an application or anything) it is of the same kind a user has requested
   a state/query proof from (e.g. some Avalanche user has requested a state/query
   proof of another independent, application-speficfic Avalanche deployment), 
   then it results into increasing the throughput of the original protocol
   cluster deployment.

So, what we're interested in describing this time is a second use case.

## Okay. Isn't it a thing which you've done already? What is so new about it?

Ah, not that fast, fellow. What is being done right now is a single-directional
Mina-Ethereum bridge core (which effectively an in-EVM Mina verification is).

> We can briefly walk through the current implementation.
> Since strainghtforward Kimchi proof verification on EVM is too expensive to be 
> done, it was decided to wrap Kimchi proof verification with a Placeholder's 
> (=nil;'s proof system) proof, create "proof of a successful proof verification" 
> and verify such a wrapping proof in EVM.
>
> So the overall current process step by step is as follows:
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

But! What a second use case of a =nil;'s trustless I/O extension brings is a
state and DBMS query proofs of a various third-party protocol (e.g. Ethereum,
Solana or Avalanche). And, since it is also possible to switch the proof system
which is being used within the =nil;'s trustless I/O replication protocol
extension for the proof generation, those query and state proofs are coming to 
any proof system supported. In Mina's case described we're talking about generating 
proofs in Kimchi.

> To be more presice we have a couple of options how to arrange this:
> 1. To generate state and query proofs right in Kimchi proof system right
>    inside the I/O cluster and provide a user with a choice which proof system
>    to use with something like
>    `_db["eth"].select("accounts").where("key").equals("name").and("value").equals("100")`
>    so that would return a Kimchi proof ready to be verified on Mina's side right away.
>
>    But! A downside of such an approach is that a proof generation will become
>    a more expensive operation for a user because of the need to duplicate a
>    third-party's protocol state proof originaly generated in in Placeholder in
>    Kimchi.
>
> 2. To wrap the state/query proof generated in Placeholder proof system with 
>    implementing its verification as a Kimchi circuit. This would result into 
>    having an additional wrapping proof generation for each query, but it would 
>    make a state proof generation cheaper.
>
>    A second option seems to be more viable.

So, such a specification of a proof system used for an output proof generation
leads us to being able to verify these third-party protocol data proofs right 
away with Mina's native verifier (used for its state proof), which leads us to...

## Mina Bi-Directional Bridging!

Yes!

Let us consider such a process step-by-step.

1. First of all, we need a state proof of a third-party protocol we want to
   bridge to Mina generated in Placeholder proof system and wrapped into Kimchi 
   proof system. Let us say it is going to be Ethereum (but actually in can be
   any other protocol supported by =nil;). So a user or an application willing
   to bridge Ethereum to Mina is supposed to retrieve such one from =nil; along 
   with a proof of a piece of data (e.g. so-called "token" data).
2. Next step is to submit a retrieved proof to Mina's native verifier, to the 
   same one which is being used for native Mina's state proof verification.

   From Mina's protocol perspective, such a =nil;-generated data proof will be
   recognized in the same way as a native Snapp-generated one. A =nil;-flavored
   Snapp.
3. After a third-party protocol's data proof is submitted to Mina's verifier,  a
   user (or a Mina-based application) receivese a third-party's protocol
   actual data (not just a proof) from =nil; as well and voila! Ethereum's data
   is being safely and trustlessly used in Mina.

![](/assets/images/2022-06-01-mina-integration/case1.png)

## What about other protocols?

Other protocols, supported by =nil; are also going to be available for Mina-compatible 
state/query proof generation and retrieval. For example, Solana is on its way.

Same process as for Ethereum from user story side:
1. Retrieve a state/query proof with Solana's data generated with Placeholder 
   and wrapped with Kimchi proof system from =nil;.
2. Submit such a proof to Mina's native verifier just like you would do with a
   Snapp's proof.
3. Feel free and safe to use Solana's data within the Snapp.

## And a data proof from a combination of protocols?

Yes! It is a DBMS which supplies =nil; with data, remember?

So, in case a user wants to bridge Solana's and Ethereum, the only adjustment to
the user story would be to retrieve a proof of a composite query from =nil; with
something like: `SELECT FROM SOLANA WHERE a EQUALS b; SELECT FROM ETHEREUM WHERE
c EQUALS d`. Then =nil; would return a proof of such a query generated in
Placeholder proof system and wrapped with Kimchi, which will be okay for Mina's
native verifier, so one can safely use other protocols data in Mina.

## When?

To our best knowledge right now we plan to introduce a first working prototype
of Ethereum's state/query proof generator compatible with Mina's proof system in
Q4 2022.

Stay tuned!
