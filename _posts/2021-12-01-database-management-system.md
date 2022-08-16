---
title: <span style='font-family:Menlo, Courier, monospace'>=nil;</span> Database Management System.
layout: post
date: 2021-12-01
excerpt: Data management done right.
author: Mikhail Komarov
tags: dbms cpp
comments: false
---

## What is this about?

This post is about <span style='font-family:Menlo, Courier, monospace'>=nil;</span> Database Management System called <span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span> - the second part of <span style='font-family:Menlo, Courier, monospace'>=nil;</span> Foundation mentioned within our [Twitter "About" section](https://twitter.com/nil_foundation) ("Home foundation for <span style='font-family:Menlo, Courier, monospace'>=nil;</span> Crypto3 and <span style='font-family:Menlo, Courier, monospace'>=nil;</span> DBMS projects").

**Warning:** I don't really like to use marketing-purposed names, but this post
is an explanatory one, so I have no other choice.

## Introduction

Providing a single cluster's compressed data (a proof of any kind) to another 
one introduces a perfect and secure way to append the data to the second cluster, 
assuming some other data is absolutely and definitely present in the first cluster. 
Sounds complicated, but this is what literally "zk-bridging" is about. 

But, when it comes to applications, more explicit data from the first cluster 
is required to be provided (e.g. asset amount which should be issued on the 
second cluster's - Ethereum - side) for the application to be fully functional. 
This is required because first cluster's (e.g. Mina, Solana, others) state proof 
deployed to the second cluster (e.g. Ethereum, Solana, others) only allows to 
check the explicitly provided afterwards data is correct and IS or WAS present 
in the source cluster. And such data retrieval still requires for the source 
cluster node to be up and running. Even some remote and untrusted one, but it has 
to be present.

Regular solution to that is to get all the necessary nodes up and running. But
wouldn't it mean large scale deployment, API provisioning and maintenance expenses 
for thousands of clusters? Yes. That would be a disaster in terms of maintenance. 
This also introduces a need to develop a unique API to each cluster (database) 
to be able to provide a consistent data allowing to generate state proof which 
would mean something. 

> For example, to prove Solana's state it is required to retrieve the
> "Light-Client's" state and append it's proof with transactions proofs (or raw
> data) in case they are about to be "bridged". Mina does require a different kind
> of state proof to be retrieved, but any particular application would require for
> the additional data to be retrieved as well (e.g. "bridged" asset amount).

Such data retrieval issues also often lead to the feeling that the data is
hidden somewhere inside the node implementation instance and it is extremely
hard to retrieve it. And when one finally retrieves it, it cannot be trusted.

**Now, try to answer me.** When was the last time when you hadn't had such a feeling?
Maybe it was when you were browsing you files with your file manager? 
Or, even better, maybe it was when you were writing some `SELECT FROM` or 
`INSERT INTO` SQL-query? 

**Don't even try to argue. It was exactly back then.**

This means the most comfortable way to access the reasonably-sized
chunk of structured data is a query language. This usually gets achieved by indexing
solutions which in most cases turn out to be a node deploy along with some DBMS
(PostgreSQL, MySQL/MariaDB, others) deployed nearby, having a synchronizing
service instance. This leads to at least three services deployed, a
person dedicated to maintain them in case they are being used in production and
at least several seconds delay (sometimes even more) between the data coming 
into the node and the data becoming available in the DBMS running nearby.

The query-language read-only (i.e. `SELECT FROM`) access scalability  
is achieved by hosting several nodes.

But, how to cheapen such a deployment cost back to what it was before? Is it
possible to cheapen it even more by reducing the amount of deployments for large
bridge proof processors (or any other folks keeping a lot of different protocol 
nodes up and running)? And what about `INSERT INTO`?

## The Approach

To answer these questions we need to change the approach applied to the data
management from what it currently is, to what it is within more mature, educated, 
experienced and less childish industries. The proposal is to take a 
look at Database Management Systems industry. Yes the one, where Amazon DynamoDB 
and Google BigTable along with PostgreSQL, MySQL/MariaDB or Apache Cassandra are 
already in play. The one, where people know something about data management.

## So, what if this whole cryptocurrency industry was not invented by cryptographers, but by those who do database management systems?

Yeah. By someone like [Michael Stonebraker](https://en.wikipedia.org/wiki/Michael_Stonebraker) 
(don't you dare to Google the name) or [Michael Widenius](https://en.wikipedia.org/wiki/Michael_Widenius) (really, are you going to Google this name as well?). How would it look like?

Well, first of all, there would be no such amount of newborn bullshit terminology.

1. "Bl*ckch*in Netw*rk" would've simply been a "Fault-tolerant full-replica
   database cluster with authenticated cluster commit log data structure" 
   (or something like that).
2. "Mempool" would've been a "Cluster commit log head section".
3. "Bitcoin", "Ethereum" and all the others would've simply been "Database 
   replication protocols".
4. "ProofOfShit" consensus algorithms would've been just some different "data-driven consensus" 
   algorithms family.
5. No "Blocks". Fault-tolerant replicating databases work perfectly with
   per-transactional replication. 

   > I have to admit in here that per-transactional replication makes it hard to 
   > maintain a proper cluster consistency with REALLY distributed cluster nodes. 
   > But anyway, time goes by, network becomes more boardwalk along with better 
   > connectivity, than it was back in 2008.

6. No "Chains". Calling a cluster commit log which is simply handled by a little
   more complicated data structure, than a regular double-linked list (it is
   in most cases a single-linked list with identifiers being built as Merkle tree 
   hashes actually) a "Chain" is ridiculous.

   > And, again, I have to admit that cluster commit log data structure differ 
   > from replication protocol to replication protocol.

Lots of other terms and notions would've never existed or would make much more
sense.

## Reinventing the wheel? What for?

Really? From the perspective of a DBMS industry it looks exactly vice versa.
Actually, lots of cryptocurrency industry problems would've simply never existed 
if the proper approach was taken from the very beginning. Let us consider some of 
them.

## Data Availability

The absence of each cluster's access to each other's cluster data brought to
life a set of unnecessarily overcomplicated protocols, aiming to provide clusters 
with each other's data read (the Graph, Celestia, etc) or write access (Polkadot,
Cosmos, Wormhole, etc).

Database management systems, which are capable of providing read-write inter-database 
queries, don't have such a problem by design.

## State Size

Bitcoin, Ethereum, Solana, Avalanche and other replication protocols aiming to 
provide services either to the large amount of people either to high-load
services are struggling with their [state size](https://www.reddit.com/r/ethereum/comments/qzvsfq/impromptu_technical_ama_on_history_expiry/). 
For some reason struggling replication protocols are trying to solve this issue 
by introducing a [protocol-level solution](https://notes.ethereum.org/@vbuterin/data_sharding_roadmap), while more traditional and established 
way of solving this issue from the DBMS industry perspective is a state clustering. 
Sharding the oversized state via 
[Paxos](https://en.wikipedia.org/wiki/Paxos_(computer_science)) or 
[Raft](https://en.wikipedia.org/wiki/Raft_(algorithm)) network-based consensus 
algorithms to several data-storing DBMS slave-nodes.

> Yes, this means there would be a need to introduce a synchronization mechanism 
> which would allow the sub-clustering. But it is still not a protocol-level 
> solution, but just a software architecture.  

## Query Language

The struggle, with which this whole conversation was started, is already solved 
within the DBMS industry for almost 30 years. Structured Query
Language-alike dialects (for RDBMS) and more custom query languages (for
so-called "NoSQL" databases) provide extensive access to the reasonably-sized
data chunks (in case DBMS node operator doesn't get nuts and starts to store
large byte blobs inside) with a consistency strong enough for 
[OLAP](https://en.wikipedia.org/wiki/Online_analytical_processing).

## Node Maintenance Costs

Node deployment and maintenance cost is another struggle this conversation was 
started from. Currently existing approach, which supposes for every replication 
protocol to have its own unique implementation reminds me of a situation within 
the DBMS industry in late 70s. Each protocol node instance, not designed to be 
run on the same machine (no matter, virtual or physical) with another protocol 
forces whoever wants to run them all to deploy separate pieces of hardware for 
them.

> Perfect example is an old [Graphene framework](https://github.com/cryptonomex/graphene), 
> used by Dan Larimer for his Steemit/EOS ventures. It was designed to use OS 
> shared memory as an in-RAM storage, which made it literally impossible to 
> coordinate a couple of instances running within the same OS instance because 
> several node instances were interfering with each other's shared memory 
> allocations, causing failures.
>
> Since, it is impossible to control the tech stack which every replication
> protocol uses for its implementation, the only way to run several databases
> using different replication protocols (e.g. Bitcoin and Ethereum and Solana)
> within the same hardware instance is run them with a DBMS.

So, having a single DBMS instance running several databases with replication
protocols specific to each of them makes node maintenance cost cheaper in case
the amount of hardware necessary to sub-shard the state of each of them is lower
than the amount of hardware necessary to run each node independently.

## Alright, alright. You're not pitching this for nothing, right? You do have something up your sleeve?

Sure. <span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span>
project of ours ([https://dbms.nil.foundation](https://dbms.nil.foundation)) is 
a database management system capable of handling fault-tolerant
replication-enabled clusters. And when I'm talking about such clusters, I'm 
talking about existing protocols (e.g. Bitcoin, or Eth, etc) as well.

## How?

By using an old-good DBMS industry-specific way. Implementing a replication
protocol adapter. Just like they do with MySQL/MariaDB replication protocol, for
example: [https://github.com/Begun/libslave](https://github.com/Begun/libslave).

Same approach works within <span style='font-family:Menlo, Courier, monospace'>=nil; 
'DROP DATABASE *</span> as well. By implementing replication protocol adapter of a certain protocol 
family (Bitcoin, Litecoin, Bitcoin Cash, Feathercoin and others, for example, 
are of the same family), <span style='font-family:Menlo, Courier, monospace'>=nil;
'DROP DATABASE *</span> becomes the full-featured node of each of those clusters. And by running
several databases with replication protocols, specific to them within a single 
DBMS node (e.g. Bitcoin and Ethereum and Polkadot), a DBMS instance becomes the 
full-featured node of each of them using the only piece of hardware (it should
be a pretty performant one, but still a less performant which would've been
required for three independent nodes) along with providing each of these
databases with the same query language, state sharding and data access capabilities.

> Funny thing, that some particular replication protocols (like Eth2) being
> considered from the DBMS point of view, will become several databases within the
> DBMS. Ethereum 2.0's shards, for example, should be considered as separate
> databases. One shard - one database. So <span style='font-family:Menlo, Courier, monospace'>=nil;</span> 
> DBMS is not only about managing the data of different databases (of different 
> clusters), but about managing the data of different clusters (shards) of a single 
> database as well.

## There is a nuance in here which should be noted!

Replication protocol is not a term I've invented just to name some already 
known mechanism differently just to make it look like it is something new.
"[Replication protocol](https://dev.mysql.com/doc/dev/mysql-server/latest/page_protocol_replication.html)"
is a very old and widely known term among database management system industry 
meaning the same as 
crypto wheel-reinventing industry calls a "[Gossip protocol](https://github.com/ethereum/consensus-specs/blob/dev/specs/phase0/p2p-interface.md)".

So, the *NUANCE*. Replication protocol implementation has very little to do with 
"virtual machine" compatibility. Single replication protocol (some particular one, 
lets say, Bitcoin) implementation mostly covers all the other same-family protocols,
compatible on a "Gossip protocol" level (e.g. Bitcoin Cash, Litecoin, others).

Another example is [libp2p](https://libp2p.io) compatibility automatically brings 
the basis to enable the replication of any other database using such a toolchain.

## Alright. You do have something which solves all the problems you've mentioned within the DBMS of yours, right?

Exactly. 

1. **Query Language:** Query language being used is based on a Turing-complete 
   interpreter and is designed as library-level language. Long story short, this 
   allows to implement an EDSL emulating SQL-alike language over some more 
   general-purpose language (C++, JavaScript, Rust, you name it). Such approach makes 
   it possible to employ all the advantages of a user-selected general-purpose 
   language ecosystem (much larger usually, than any newborn project can offer) 
   for data management along with SQL-alike language availability for more
   traditional (and formal) data management. This also means swappable query
   languages.

2. **State Size**: Sub-clusterization. Fault-tolerant full-replica cluster with 
   commit log built with authenticated data structure every member of which 
   handles its state sharded with Raft is something 
   <span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span> does by default.

3. **Data Accessibility:** That is right, accessibility, not the "availability"
   thing. Availability is a read-only property. Accessibility supposes
   read-write properties. 

   Bitcoin and Ethereum families replication protocol adapters along with several 
   own replication protocols implementations (DBMS-based fault-tolerant full-replica 
   cluster, Raft) (with all of them available for sub-clusterization) are provided 
   by default. More replication protocol adapters are coming.

   Inter-database read/write queries are one more crucial component of data 
   accessibility. Providing a user with `SELECT FROM BTC.TABLE1 WHERE ... AND FROM
   ETH.TABLE4 WHERE ...` along with `INSERT INTO BCH.TABLE2 (SELECT FROM
   SOL.TABLE1...`-alike queries is a crucial component.

4. **Maintenance Costs:** Processing several databases with the same piece of
   software makes internal data management techniques consistent, so that 
   allows to eliminate the reason why several protocol implementations usually
   do not get launched on top of the same hardware - inconsistent with each other 
   implementations (obviously no protocol supposes for the other protocol's daemon 
   to be launched on the same hardware). 

   At the same time, swappable storage engines do not allow databases, clusters 
   of which use replication protocols requiring constant and rapid 
   state traversals (e.g. Ethereum-alike protocols), to degrade with its replication 
   and data management performance with using a special-purposed data storage
   engines, specific for the particular replication protocol.

## Wait a minute. Why do you need your cryptography suite then?

Simple. Replication protocol adapters require lots of very different
cryptography to be used. Some of them use exotic hashes, some of them use
zero-knowledge proof systems, others use exotic signatures. Handling them all
using third-party modules results in the need for them to be patched and
adjusted anyway. So developing a cryptography suite of our own turned out to be
easier.

## And the bridges?

Bridges need data accessibility layer. Not the **availability** (it is a
read-only thing), but **accessibility** (read-write thing). The connection
between the <span style='font-family:Menlo, Courier, monospace'>=nil; 'DROP DATABASE *</span> 
and our bridge project will be outlined in a dedicated post. Stay tuned!

## So, in case such approach solves so many problems, maybe it should've been taken from the very beginning?
