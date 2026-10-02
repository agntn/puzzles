import {
  answer,
  claim,
  compressed,
  funding,
  official,
  source,
  technique,
  wif,
} from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 36 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bcx8ju/easy_7_mbtc_quizchain_block_36/";

/**
 * Quizchain block 36: a phrase from the author's hint post, a space and the last three characters
 * of the block 35 key, hashed with MD5 into BIP39 entropy. It was claimed in the funding block,
 * before the post. The winner told the author it was done by hand. No source printed the hash or
 * the key.
 */
export const quizchainBlock36 = puzzle({
  id: "quizchain/36",
  chain: "bitcoin",
  address: "17CaBqDJGm4pr8Bijb6PeGaaU9APAL5Jwk",
  sourceUrl: THREAD,
  startedAt: "2019-04-14 00:33:27",
  status: Status.Solved,
  pubkey: compressed("03a3a050d4f47e0ef6ce9fe221b29e3d5f275cc30547213056ada4a1e68d3005a0"),
  key: wif("Kz7Czh9CiNGjv6Ut3Zxd1ErWS8j8tEbF3kY9v8ha6j9BJ4qJxvXY")
    .entropy(
      "4fcb73c01427a6d689979ef5ad7cd722",
      source(
        THREAD,
        "MD5 of the phrase and the last three characters of the block 35 key, separated by a space",
      ),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("How are you this morning, Ms. Nakamoto? Thank you, I am good.", THREAD, undefined, {
      answer: answer(
        'Solution for this was "Google only one way", which is a new phrase I mentioned in my hint post.',
        THREAD,
      ),
    }),
    official(
      "Format: [word1 word2 word3 word4] [link] with exactly one space between them.",
      THREAD,
    ),
    official("I already said where the hint for this is elsewhere.", THREAD),
  ],
  solvedAt: "2019-04-14 00:33:27",
  solveTime: 0,
  transactions: [
    funding(
      "5ffb530c3039f03c59943eccfe67f76708343aafdc0e5d2ab7b78340e9438e2c",
      "2019-04-14 00:33:27",
      0.007,
    ),
    claim(
      "80370bbffc9e28b4fd16a73f4c025c92611fa41885d90fec37aac10b18ac5814",
      "2019-04-14 00:33:27",
      0.00674944,
    ),
  ],
});
