---
title: =nil; Database Management System.
layout: post
date: 2021-10-25
excerpt: Data management done right.
author: Mikhail Komarov
tags: dbms cpp
comments: false
---

## What is this about?

This post is about <span style='font-family:Menlo, Courier, monospace'>=nil;</span> DBMS - the second part of <span style='font-family:Menlo, Courier, monospace'>=nil;</span> Foundation mentioned within our [Twitter "About" section](https://twitter.com/nil_foundation) ("Home foundation for <span style='font-family:Menlo, Courier, monospace'>=nil;</span> Crypto3 and <span style='font-family:Menlo, Courier, monospace'>=nil;</span> DBMS projects").

**Note:** this post style is deviant from the Q&A style I usually take. Please, 
don't consider subtitles as questions from the reader side. This is more of a
monologue/presentation/pitch write-up.

## Introduction

Providing a single cluster's compressed data (a proof of any kind) to another 
one introduces a perfect and secure way to append the data to the second cluster, 
assuming some other data is absoutely and definitely present in the first cluster. 
Sounds complicated, but this is what literally "zk-bridging" is about. 

But, when it comes to applications, more explicit data from the second cluster 
is required to be provided (e.g. asset amount which should be issued on the 
second cluster's - Ethereum - side) for the application to be fully functional. 
This is required because first cluster's (e.g. Mina, Solana, others) state proof 
deployed to the second cluster (e.g. Ethereum, Solana, others) only allows to 
check the explicitly provided afterwards data is correct and IS or WAS present 
in the source cluster. And such data retrieval still requires for the source 
cluster node to be running. Even some remote and untrusted one, but it has to 
be present.

Regular solution to that is to get all the necessary nodes up and running. But
wouldn't it mean extreme deployment and API development and maintenance expenses 
for thousands of clusters? Yes. That would be a disaster in terms of maintenance. 
This also introduces a need to develop a unique API to each cluster (database) 
to be able to provide a proper data allowing to generate some state proof which 
would mean something. 

> For example, to prove Solana's state it is required to retrieve the
> "Light-Client"'s state and append its' proof with transactions' proofs (or raw
> data) in case they are about to be "bridged". Mina does require a different kind
> of state proof to be retrieved, but any particular application would require for
> the additional data to be retrieved as well (e.g. "bridged" asset amount).

Such data retrieval issues also often lead to the feeling that the data is
hidden somewhere inside the node implementation instance and it is extremely
hard to retrieve it.

**Now, try to answer me.** When was the last time when you hadn't had such a feeling?
Maybe it was when you were browsing you files with your file manager? 
Or, even better, maybe it was when you were writing some `SELECT FROM` or 
`INSERT INTO` SQL-query? 

## Don't even try to argue. It was.

This means the most comfortable way to access the reasonably-sized
chunk of data is a query language. This usually gets achieved by indexing
solutions which in most cases turn out to be a node deploy along with some DBMS
(PostgreSQL, MySQL/MariaDB, others) deployed nearby, having a synchronizing
service instance. This leads to at least three services deployed, a
person dedicated to maintain them in case they are being used in production and
at least several seconds delay (sometimes even more) between the data coming 
into the node and the data becoming available in the DBMS running nearby.

Here we go, the query-language read-only (i.e. `SELECT FROM`) access possibility 
is achieved by multiplying several times the node maintenance cost.

But, how to cheapen such a deployment cost back to what it was before? 
And what about `INSERT INTO`?

## Approach

To answer these questions we gotta change the approach applied to the data
management from what it currently is, to what it is within more mature,
educated, experienced and less childish industries. The proposal is to take a 
look at Database Management Systems industry. Yes the one, where Amazon DynamoDB 
and Google BigTable along with PostgreSQL, MySQL/MariaDB or Apache Cassandra are 
already in play. The one, where people know something about data management.

## So, what if this whole cryptocurrency industry was not invented by cryptographers, but by those who do database management systems?

Yeah. By someone like Michael Stonebraker (don't you dare to Google the name, you 
incompetent fucker) or Michael Widenius.
