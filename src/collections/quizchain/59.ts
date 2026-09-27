import {
  answer,
  claim,
  compressed,
  funding,
  official,
  p2pkh,
  source,
  wif,
} from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 59 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bg96js/7_mbtc_quizchain_block_59/";

/** The author's comment of April 23, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bg96js/comment/eljqp8n/";

/**
 * Quizchain block 59: `Zeus`, found in the tail of the block 58 key, then TOMI, that tail and the
 * whole block 58 key, hashed with MD5 into BIP39 entropy. From here the link is the whole previous
 * key. The post links the address instead of the funding transaction. A player printed the WIF in
 * the block 60 thread.
 */
export const quizchainBlock59 = bitcoinPuzzle({
  id: "quizchain/59",
  address: p2pkh("1LFwAti63u7rxoEveRQnPkGtU8PHW6YxHY", "d33d6ec21b342c5e3a8d809095f54911a7d1f547"),
  sourceUrl: THREAD,
  startedAt: "2019-04-22 23:41:53",
  status: Status.Solved,
  pubkey: compressed("02a76d303c939f451d0734107e8241ff4d1a618b9cebe59c8c566201e004aba2b1"),
  key: wif("Kxh2nag7eeF57q7hcNqbJxFvreXbh3kfTid4jJCzbDsp7kS5ehsq").entropy(
    "3a3973f56c25533ba50a18aec75142fc",
    source(
      THREAD,
      "MD5 of the god, TOMI, the last seven characters of the block 58 key and that whole key",
    ),
  ),
  prize: 0.007,
  hints: [
    official("Question: God", THREAD, undefined, {
      answer: answer(
        "Note the last seven digits. They start almost with the name of Zeus, one of the Greek gods.",
        THREAD,
      ),
    }),
    official(
      "Link is complete private key of last block for this one, not only last seven digits.",
      THREAD,
      undefined,
      {
        answer: answer("And TOMI for this was just these seven digits.", THREAD),
      },
    ),
    official("One item, but not necessarily a word...", AUTHOR_COMMENT),
  ],
  solvedAt: "2019-04-23 04:03:54",
  solveTime: 15_721,
  transactions: [
    funding(
      "cc03863deb7b84cb929a2ba596a58649fc81ae9ba7a67d135b209fca765f4581",
      "2019-04-22 23:41:53",
      0.007,
    ),
    claim(
      "cbd4afe89ed5da1c7d0f8a979892a814382f64d5ffdad5f0784dc36db5b43ae8",
      "2019-04-23 04:03:54",
      0.0069,
    ),
  ],
});
