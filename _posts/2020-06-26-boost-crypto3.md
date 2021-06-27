---
title: =nil; Crypto3 for Boost. Boost.Crypto3 Release.
layout: post
date: 2020-06-26
description: Initial Boost.Crypto3 release.
author: Mikhail Komarov, Nikita Kaskov
tags: boost crypto3 cryptography cpp
---

So, what should cryptography for Boost (and probably STL some years after) look like?”

1. It should definitely be simple to use and implemented with some generic programming spirit.

That is exactly what was done. Remember std::transform? 
Typical usage technique for all of the modules of a suite looks as follows.

Classic iterator pair with output iterator:

using namespace nil::crypto3;
std::string input = “Weird German 2 byte thing: Ã.“, out;
encode<codec::base64>(input.begin(), input.end(), std::inserter(out, out.end()));

Classic iterator pair with output value return:

using namespace nil::crypto3;
std::string input = “00112233445566778899aabbccddeeff”;
std::string key = “000102030405060708090a0b0c0d0e0f”;
std::string out = encrypt<block::rijndael<128, 128>>(input.begin(), input.end(), key.begin(), key.end());

C++20 Ranges (or Boost.Range) usage:

using namespace nil::crypto3;
std::vector<std::uint8_t> input = {0x27, 0x0f, 0xb1, 0x89, 0x82, 0x80, 0x0d, 0xa6, 0x40};
std::string out = encode<codec::base32>(input);
// or
encode<codec::base32>(input, out);

What about generic encoding/encryption/signing/hashing/%name_your_action% interface for classes?

This is also handled

2. It should contain only time-proven schemes implemented with well-known and proven techniques. 

As far as you can see in the repository’s organization, the suite contains some very novel schemes 
(Verifiable Delay Functions) and it is going to contain more (threshold cryptography, zero-knowlege 
        cryptography, cryptographic accumulators etc.). But Boost-ified version has to be a solid one. No novel
schemes. Only proven ones with proven implementation techniques. What ones? This is what Boost 	
community is up to decide.

So, the question for the community. What schemes should be included?

3. It should have a concept-based architecture.
Concept-based architecture supposes	

4. Chosen generic architecture 

This suite is pretty drafty, some modules’ private versions at some point were used (and still being used) in production, some of them were used for research efforts, but the public version is drafty.

This suite is being developed for now not only by me, but by the team, which builds commercial products on top of the suite (this mailing list forbids commercial projects advertising, so I don’t

What we would like to hear from Boost community is some guidance about what would be useful for Boost, critics about architecture and concepts.
