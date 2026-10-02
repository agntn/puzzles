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

/** Where the question and the funding txid of block 65 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bhloyj/1_of_3_7_mbtc_quizchain_block_65/";

/** The author's comment of April 26, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bhloyj/comment/eltqjv0/";

/**
 * Quizchain block 65: the timestamp of Bitcoin block 65, TOMI, `blockchain block 65` and the whole
 * block 64 key, hashed with MD5 into BIP39 entropy. First of a series of three blocks funded in the
 * same Bitcoin block. No source printed the hash or the key.
 */
export const quizchainBlock65 = puzzle({
  id: "quizchain/65",
  chain: "bitcoin",
  address: "1PGv1YpL4zJMZHoXSUcNurjen5uitW6oHd",
  sourceUrl: THREAD,
  startedAt: "2019-04-26 12:21:11",
  status: Status.Solved,
  pubkey: compressed("027375e70bb6b999527f211fb8d5ad69cc5e318eff703234bddc23210c2185461a"),
  key: wif("L1uF3U83zfBKJ6v3fV7fdFZCuhu39HcmncLJ7L2Ktokjjxdes9A7")
    .entropy(
      "be90557b2ec9548b1fa31a3611021f06",
      source(THREAD, "MD5 of the time, TOMI, the three words and the whole block 64 key"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: I am looking for the time of the day.", THREAD, undefined, {
      answer: answer(
        'Solution was found in the timestamp of "blockchain block 65", which was 21:55:03, and the TOMI field was what I just put in quotation marks.',
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [word1 word2 number] [link]", THREAD),
    official(
      "Format for solution is like this: For example for half past six pm time: 18:30:27, last two digits are seconds.",
      THREAD,
    ),
    official(
      "Full private key of block 64, L565NraUtwZkJfjMwv8Zi58fSfMe6J8jhUYbVvKY6FPKLjod36og.",
      AUTHOR_COMMENT,
    ),
  ],
  solvedAt: "2019-04-26 13:42:26",
  solveTime: 4875,
  transactions: [
    funding(
      "baead4a5bd4b19725c4f9795fc805d851e44a0dd914572f60d99d7d987171d6a",
      "2019-04-26 12:21:11",
      0.007,
    ),
    claim(
      "3164cad3e09c37fdcae76a946294da8e37b3c7860a3b36a0c500eb221ed66825",
      "2019-04-26 13:42:26",
      0.00680646,
    ),
  ],
});
