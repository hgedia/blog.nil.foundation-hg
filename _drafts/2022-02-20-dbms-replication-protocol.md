---
title: =nil; Database Management System Replication Protocol.
layout: post
date: 2022-02-20
excerpt: What full data accessibility clusterization leads to.
author: Mikhail Komarov
tags: dbms io
comments: false
---

## What is this about?

This post is a reveal of a bigger picture vision of ours, putting all the 
projects we're working on together. Including our 
[Mina-Ethereum](https://blog.nil.foundation/2021/11/01/mina-ethereum-bridge-design.html) and
[Solana-Ethereum](https://blog.nil.foundation/2021/11/01/solana-ethereum-bridge-design.html) 
trustless bridges along with a 
[=nil; Database Management System](https://blog.nil.foundation/2021/12/01/database-management-system.html).

## Introduction

=nil; DBMS eliminates data accessibility and deployment cost problems as if they 
never existed by managing several public fault-tolerant replication-enabled 
databases with the same piece of software and by providing a query language, 
same to all the databases, which replication protocols are supported. Typical 
DBMS features. Another typical modern DBMS feature is clusterization. Same 
thing =nil; DBMS provides as well.

Having any public databases' (or protocol's if you really like that) data 
manageable with the same language, naturally induces the desire to start a 
cluster on top of such a solution and see what can be achieved with this. 
This leads to the necessity to introduce some native replication protocol, 
besides third-party ones.

Just as with third-party replication protocols, native replication protocol
should be compliant to the replication protocol adapter interface.

## Okay. What it is going to be?

Traditional DBMS-provided clusterization is a network communication-based,
by-design fragile in favor of replication/partitioning performance and
is supposed to work within trusted environments. If any fault-tolerance is 
achieved within such consensus algorithms family 
(e.g. [Byzantine Paxos](https://en.wikipedia.org/wiki/Paxos_(computer_science)#Byzantine_Paxos)), 
it is, again, very sensitive to network communication environment and is supposed 
to handle minor participants misbehaviour at its best.

Less fragile clusterization is usually achieved by on-data consensus, leaving
networking to deal with data transfers only. Bitcoin, Ethereum and others use
this kind of clusterization to maintain database clusters of extremely low
consistency, but of a proper availability.

So, what do we end up with regarding clusterization options for =nil; DBMS-based
clusters (for the sake of proper architecture generalization)?
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

So, the set of options picked should depend on the purpose of such a public cluster.

## Alright. Let's pick a purpose then. Something useful please.

Sure. 

The most obvious thing is to exploit something no one else has - total data
accessibility. To provide everyone with everyone's data, for example. Or to
provide end-user applications with the entrypoint to the whole industry.

There is a couple of options on how to set this up:
1. Set up a managed DBMS hosting, which would contain all the clusters' data
   (aka Infura with SQL).

   Guess, what is the problem with that? It is hard to grow such a thing
   (especially nowadays). Extensive infrastructure which should be managed by
   the only organization - =nil; Foundation-related one. And we do already have
   Amazon, Google Cloud and all the others. And it is also not a reliable data
   source. Doesn't seem like an option to me.

2. Set up a publicly-replicatable database cluster so every willing party could 
   join anytime strengthening the data-providing infrastructure in the same time.

   I like this option. Scales fast. And it still would result into a data
   provider-alike solution in case the protocol makes at least several participants 
   to have necessary cluster's replication enabled (e.g. Bitcoin, Ethereum and 
   Polkadot in a single node in the same time).

   > Actually, making it possible for everyone to be able to join, would require:
   > * Introducing access rate limitations to avoid overwhelming participants hardware for nothing.
   > * Some mechanism to make participants to keep necessary data (not just to 
   >   generate random junk and give it to user).
   > * Mechanism to prove a particular data chunk actually belongs to the database a user requested some data from.
   > * 

## Let us say I joined such a cluster with my hardware willing to provide folks with data. What it is to me?

Good question. Simply providing anyone with anyone's data makes almost no sense
(except a unified query language feature) since a user can simply retrieve it 
from the original source and that is it. 
