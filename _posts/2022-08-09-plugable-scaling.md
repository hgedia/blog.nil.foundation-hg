---
title: <span style='font-family:Menlo, Courier, monospace'>=nil;</span>'s Pluggable Scaling.
layout: post
date: 2022-08-09
excerpt: What is Pluggable scaling?
author: Haresh G.
tags: dbms io
comments: false
---

## What is this about?

Once blockchain networks are implemented as databases, it enables us to borrow a number of existing
solutions from the DBMS industry. In this post we take a look how scaling can be modularised using a 
=nil;DBMS node.

## Goals

DBMS have a number of solutions to  performance bottlenecks. In order to increase
throughput , a database can be sharded by moving data which requires higher throughput into its own 
partition. Multiple clusters can be run in configurations (master-master/master-slave) to enhance
response times.   

This has inspired solutions from the industry such as side-chains,  L2 or hub-spoke networks. Using 
the above constructs of sharding/clustering, we can scale existing networks without having to rely 
on additional trust assumptions.

# Concepts

Let us go over some concepts which will help us understand the solution.:

**Query Language** : 
Nearly all DBMS systems support a declarative query language. This
allows the user to write queries such as `SELECT * FROM EMP`. The language parser chooses
to optimise on user's behalf. =nil;DBMS supports both a way to write declarative queries
or write in an imperative language (js,rust etc.). Both of these get pre-compiled. These
also generate circuits for the query requested.

**Placeholder proof** : 
Placeholder is =nil's in-house proof system for which all proofs are generated. Once a
proof system is implemented for a network, this allows a network to perform its local 
consistency checks before committing/implementing associated logic.

# Example

When users notice a slowdown in response times (or higher costs) in DBMS , it is first identified 
what subset of the data is causing the spike and based on severity, it can be moved to its own partition or
database. Similarly, when we see spikes in usage of a subset of data in blockchain networks, 
the approach should be to move this to a different partition/db (network). 
This implies your application data is stored and accessed across two or more partitions.

Since both these databases are under the same logical instance data accessibility is simplified.

- Read : Read queries are easy to implement as you can run cross partition or even DB queries.
For any slower data availability, a user can simply launch another cluster and scale horizontally. 
- Write : Write queries require two-step access. First read data from one database , add the placeholder
proof of this to the write query , which gets validated on write.


# Stats