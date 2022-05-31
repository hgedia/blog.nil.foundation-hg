---
title: =nil; Database Management System. Replication Protocol. Trustless I/O Extension.
layout: post
date: 2022-05-31
excerpt: What total trustless data accessibility leads to.
author: Mikhail Komarov
tags: dbms io
comments: false
---

## What is this about?

This post describes a protocol bringing all the projects we're working on together 
in a bigger picture. Including our 
[Mina-Ethereum](https://blog.nil.foundation/2021/11/01/mina-ethereum-bridge-design.html) and
[Solana-Ethereum](https://blog.nil.foundation/2021/11/01/solana-ethereum-bridge-design.html) 
trustless bridges along with a 
[=nil; Database Management System](https://blog.nil.foundation/2021/12/01/database-management-system.html).

## Introduction

<span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span> 
eliminates data accessibility and maintenance cost problems as if they never 
existed. This is done by managing several public fault-tolerant replication-enabled 
databases with the same piece of software and by providing a read/write query 
language, same to all the databases, which replication protocols are supported. 
Typical DBMS features. Another typical modern DBMS feature is clusterization. 
Same thing <span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span> 
provides as well.

Having any public databases' (or protocol's if you really like that name) data 
manageable with the same language, naturally induces the desire to start a 
publicly-replicatable cluster on top of such a solution and see what can be 
achieved with this. This leads to the necessity to introduce some native replication 
protocol, besides third-party ones, capable of providing such data
accessibility.

Just as with third-party replication protocols, native replication protocol
should be compliant to the replication protocol adapter interface. And it also
has to be capable of providing users with a proper throughput for the data
retrieval from many different databases to be possible.

## Okay. What it is going to be?

Traditional DBMS-provided clusterization is a network communication-based,
by-design fragile in favor of replication/partitioning performance and
is supposed to work within trusted environments (e.g. [Raft](https://en.wikipedia.org/wiki/Raft_(algorithm)) 
or [etcd](https://etcd.io)-alike ones). If any fault-tolerance is achieved within 
such consensus algorithms family 
(e.g. [Byzantine Paxos](https://en.wikipedia.org/wiki/Paxos_(computer_science)#Byzantine_Paxos)), 
it is, again, very sensitive to network communication environment and is supposed 
to handle minor participants misbehaviour at its best.

Less fragile clusterization is usually achieved by on-data consensus, leaving
networking to deal with data transfers only. Bitcoin, Ethereum and others use
this kind of clusterization to maintain database clusters of extremely low
consistency, but of a proper availability.

So, what do we end up with regarding clusterization options for 
<span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span>-based clusters 
(for the sake of proper architecture generalization)?
1. Network-based clusterization:
    1. Partitioning (implementations differ, we gotta figure out our own
       one). Used to split cluster's nodes state to several servers. So that
       would work only in case of a trusted-environment setup.
    2. Replication (Raft, Paxos, etcd, etc.). Again, low-scale clusters within
       trusted environment setup.
2. Data-based clusterization:
    1. Replication (literally sacrificing consistency in favor of accessbility).
       Mesh-based networking, noisy as hell (in terms of networking), but
       publicly accessible. This option also seems to be the best way to exploit
       total data accessibility.

But! The actual publicly-replicatable database cluster replication protocol
design will depend on a purpose of an application.

## Alright. Let's pick a purpose then. Something useful please.

Sure. 

The most obvious thing is to exploit something no one else has - *total data
accessibility*. To provide every protocol with every other protocol's data, for example. 
Or to provide end-user applications with the entrypoint to any database. 

There is a couple of options on how to set this up:
1. Set up a managed DBMS hosting, which would contain all the clusters' data
   (aka Infura with SQL).

   Guess, what is the problem with that? It is hard to grow such a thing
   (especially nowadays). Extensive infrastructure which should be managed by
   the only organization - <span style='font-family:Menlo, Courier, monospace'>=nil;</span> 
   Foundation-related one. And we do already have Amazon, Google Cloud and all 
   the others. And it is also not a reliable data source - one cannot trust the
   only one provider didn't cheated with the data. Doesn't seem like an option to me.

2. Set up a publicly-replicatable database cluster so every willing party could 
   join anytime strengthening the data-providing infrastructure in the same time.

   I like this option. Scales fast. And it still would result into a data
   provider-alike solution in case the protocol makes at least several participants 
   to have necessary cluster's replication enabled (e.g. Bitcoin, Ethereum and 
   Polkadot in a single node in the same time).

But then a data-providing publicly-replicatable database cluster will require:
1. Throughput limitation mechamism to avoid spamming the databases' contents
2. In case such a throughput limitation mechanism is introduced, this will
   require for the overall-database consistent index containing such a rate
   limitation status description to be handled by all the database cluster 
   members in a fault-tolerant replication-enabled full replica-like manner.

So, in case all the components of the protocol mentioned are implemented,
along with replication protocol adapters, then every willing party can join the 
publicly-replicatable database cluster, sync some third-party data into the 
<span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span>
instance and start providing users with the **READ AND WRITE** access to the data 
of a various database (e.g. Bitcoin, Ethereum, Solana, whatever) via the unified
query language, SQL or an imperative one (JS-based one for example).

## This will result into a data-providing relayer. Any way to make it trustless?

Now we're talking. You're absolutely right, it is better not to trust relayers.

Why? This question is redundant, of course. In case this results into a relayer-alike 
protocol, data consumer would be required to trust those members of a relay cluster, 
which can easily supply a user with a fake data, which results into trusting 
game-theoretic assumptions, which are usually pretty weak.

So, we need to remove a necessity to trust the data provider.

There are several ways to do that:
1. The most obvious way is to strenghten those assumptions with punishing those
   protocol members who attempted to provide a fake data with enabling users to
   submit a complaint about them. Something like what "the Graph" thing does. But!
   This results into so-called "optimistic security" when a plain-old dumb 
   massive data fraud is prevented (which is more of a hooliganism than a fraud), 
   but nothing prevents an attacker to wait for a very particular transaction
   and give away fake data exactly in the moment a particular transaction comes
   in.

   > By the way. What does that even mean? "Optimistic security". 
   > "Most probably it is secure"? "Most probably nothing will be stolen?"
   >
   > Oh oh, wait a minute, I got a better one. Read this with a typical Karen's voice.
   >
   > **"When your funds are stolen because of the "optimistic security" - please 
   > file a complaint. A protocol's secretary (imagine such one exists) will 
   > consider it and send you a written notice about the descision made via US Post". 
   > Thank you for using our "optimistic security" protocol (e.g. the Graph) services.**
   >
   > No, thank you.

2. A better way is to make sure no game-theoretic assumptions are being made at
   all. And that means a user performing some query has to be sure about where 
   the source of a query data without any need to re-check the data retrieved.

   How do we do that? Let us use whatever we have in disposal. And what we have
   in disposal is <span style='font-family:Menlo, Courier, monospace'>[=nil; 'DROP DATABASE *](https://blog.nil.foundation/2021/12/01/database-management-system.html)</span>. And what a typical DBMS has in 
   disposal is a query engine/planner. 

   So! Generating a SNARK proof for the query planner results into having the 
   actual data returned by a query proved to be correctly extracted from the
   database's (e.g. Solana or Ethereum) state stored within the 
   <span style='font-family:Menlo, Courier, monospace'>[=nil; 'DROP DATABASE *](https://blog.nil.foundation/2021/12/01/database-management-system.html)</span>.

   > Actually, let's consider and example proof for the following table returned
   > by a <span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span> 
   > SQL query over Solana's state.
   >
   > | account : `STRING`                           | value : `INTEGER` |
   > | -------------------------------------------- | -----------------------|
   > | 8zJd5X6VqbTQNJ27QJ3cW5aCJy5UqKAcrPUe6HfBi1C3 | 2048                   |
   > | 3C1iBfH6eUPrcAKqU5yJCc5Wc3JQ72JNQTbqV6X5dJz8 | 1024                   |
   > 
   > Now, let's consider, which circuit would be most convenient for proving
   > this trivial kind of data structure? 
   > 
   > Most probably, it is going to be a range proof (one can take a look at an example of how
   > such one gets defined formally in here: [https://hackmd.io/@dabo/B1U4kx8XI](https://hackmd.io/@dabo/B1U4kx8XI))
   > for the `INTEGER` and a plookup-enhanced bitvector proof for the `STRING`
   > type. And all this thing will have database's data as a private input. 
   > Most probably.

   But! How to prove that a particular query result doesn't only belongs to
   correctly unpacked particular database's state in the DBMS, but also that the
   databases's (e.g. Solana's) state itself was unpacked from the correct commit 
   log (e.g. belongs to the actual Solana's so-called "block sequence")?

   To prove that we need to include additional thing in a query proof's input.
   And this thing is...

## A state proof!

Yes! Exactly those ones which were in development for some time up to now with
[Solana](https://twitter.com/nil_foundation/status/1450789422996283394?s=21&t=U0yDZwY-oT9TGJ8KPNwuHQ) 
and [Mina](https://twitter.com/minaprotocol/status/1443599014797135872?s=21) fellows 
for those [Solana to Ethereum](https://blog.nil.foundation/2021/10/14/solana-ethereum-bridge.html) 
and [Mina to Ethereum](https://blog.nil.foundation/2021/09/30/mina-ethereum-bridge.html) 
bridges projects of ours.

And, for those clusters, which do not have their own state proof, Solana-alike
approach is going to be used. Those clusters, which have a state proof of their
own (e.g. Mina, Celo, others), they will enjoy query proofs almost out of the
box.

Does it gets together in a bigger picture now, huh?

## It does. But these are bridges, and now you're talking about a different application. How is that relevant?

Pretty easy. State proof in combination with 
<span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span>'s 
query proofs can lead to different kind of applications. It all depends on how
does one apply ones.

So, basically, our bridge projects were just a tryout corner-cases of an
third-party cluster integrations into the protocol of ours.

Lets consider several use cases using some **incredible innovation, a future of
blogging** (that is how they shill all that bl\*ckshit, right?) one never 
seen before in this blog - **PICTURES**.

## Trustless Data Retrieval

The first use case is exactly about what this post started from. Trustless data
retrieval.

How in particular?
1. A user (e.g. application frontend) comes in for some data. 
2. Puts a query into a <span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span>-based database cluster.
3. Retrieves a data along with a proof indicating the data was retrieved from a
   database state, which was unpacked correctly from a correct particular
   databases's commit log.

## But how to prevent a DBMS node from giviing out a user a wrong proof?

Easy. Since all the nodes of the cluster are <span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span> nodes, which have the access to all the third-party databases data at once, the 
protocol should require for the output proof to be published and verified by all 
the cluster members before a query returns a data to a user.

That means a query proof-generating node has to be incentivised to provide a
proof along with the data to user. And that means the reward for a particular
query has to be scored only when a valid query proof is published and verified
by all the I/O protocol extension cluster participants.

## And here we go. Trustless data access to various protocols data via the same <span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span> query language.

![](/assets/images/2022-02-20-dbms-replication-protocol/case1.png)

## Trustless Bridging

Let us consider a case when a client is not an application frontend, or an
exchange, or a validator (any external data consumer), but a protocol.

Let us say, we have Solana’s/Avalanche’s/any other monolithic L1’s cluster. 
And let us say, within such a cluster there is a 
<span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span> 
node with Solana’s replication protocol adapter. It behaves like Solana’s node 
(a full featured one), it quacks like one, it feels like one. But it is not one.

And! Because it provides Solana’s data in the way suitable for the 
<span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span>-based 
cluster to be able to track it, it is possible to generate the state proof out of 
Solana’s data (of a particular moment in time) every time a user requests it with 
<span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span> 
query. 

After the state/query proof was generated by the
<span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span>-based 
cluster, it is supposed to be submitted to the client protocol (e.g. Mina or Ethereum), 
where it is supposed to verify it (DBMS of ours provide the access to all the 
protocols data, remember?), allowing users to use the third-party’s cluster data 
they retrieved with the <span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span> 
query. 

## Here we go. Trustless on-demand bridging for various protocols via the same <span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span> query language.

![](/assets/images/2022-02-20-dbms-replication-protocol/case2.png)

## Pluggable Scaling

Previously we've considered a case, when both clusters on both sides of a
protocol are of a different kind (e.g. Ethereum and Solana, Solana and Mina,
etc). Now lets consider a case, when two clusters on both sides are of the same
kind (e.g. Avalanche and Avalanche).

**So, what that results into?**

Now let us say, within the that L1 cluster (e.g. Avalanche) chosen, again, there 
is a "wolf in sheep’s clothes" - a <span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span> 
node with Avalanche’s replication protocol adapter. It behaves like Avalanche’s 
node (a full featured one), it quacks like one, it feels like one. But it is not one. 

And! Again, because it provides Avalanche’s data in the way suitable for the 
<span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span>-based 
cluster to be able to track it, it is possible to generate a state and query
proofs from its state or a cluster commit log, so that means one can deploy
multiple absolutely independnt Avalanche database clusters, which will know 
nothing about each other. But! Through the I/O cluster of ours, it is possbile 
for them to generate state/query proofs of each other and access each other's 
data through the I/O cluster as well in a trustless manner.

That means <span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span> 
cluster is capable of generating state/query proofs of client L1’s 
application-specific deployments and submit them to the main cluster for the 
verification to happen. That literally means compressing various amount of data 
through so-called "validity proofs" to the main Avalanche cluster, increasing 
the throughput linearly, depending on the amount of application-specific indepedent 
Avalanche deployments. This approach is possible to be applied to any monolithic 
L1 protocol (Solana, Ethereum, any other one).

## And voila! Trustless pluggable scaling requiring absolutely no changes from client protocols.

![](/assets/images/2022-02-20-dbms-replication-protocol/case3.png)

## Time to wrap up.

The moral of the story is that all the applications described use the same and 
the only one mechanism: protocol state query proofs (query engine proofs) and 
protocol commit log's state proofs. Which is only possible to be built because
of the DBMS-based approach using very typical, very usual DBMS features such as:
1. **Replication protocol adapters.** It is only possible to access third-party
   databases' data without any need to copy it inside I/O cluster because of that.

2. **Query planner/engine.** It is only possible to prove query over the state of a
   various database because of that. And it is possible to be applied to Eth,
   Solana or whatever through I/O cluster.

3. **State partitioning.** No need in handliing terabytes of state data within
   the same machine. This is possible to be applied to Eth, Solana or whatever through 
   the I/O cluster as well.

4. **Independent Deployments**. Can't handle the load? Just get one more
   database cluster up and running and you're good to go. No need for "sharding" 
   or whatever.
   > Yes, I'm perfectly aware why all that sharding nonsense exists - there is 
   > a need to maintain a consistency of the only one database index which matters 
   > in every protocol's database in this industry - account-value index. We
   > will come to how to remove such a need in future blog posts (yes, there is
   > such a way). Stay tuned!
   >
   > It is ridiculous, by the way, how all the database purpose gets reduced to
   > the only only one thing - maintaining the only one key-value index. All the
   > other data can and will be removed (https://vitalik.ca/general/2021/12/06/endgame.html) 
   > and everyone is okay with it.
   >
   > I was even asked by a fellow very close to Ethereum foundation something
   > like "What do you want to store in the database besides account-value data? 
   > It iS nOt a DaTaBaSe, what do you want?"
   >
   > I never spoke (and never will) to that fellow again. Idiot.
   
   And, guess what? This is possible to be applied to Eth, Solana or whatever through I/O cluster as well.

5. **Proper Data Management Internals**. Some **boring old men** (who
   at first got their degrees instead of blogging about Bitcoins) say that 
   OLAP-specific and OLTP-specific database load types require different storage 
   internals than simply using RocksDB for everything.

## So, let's provide anyone with anyone's data in a trustless manner?
