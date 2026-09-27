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

/** Where the question and the funding txid of block 73 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bjezpd/10_mbtc_quizchain_block_73/";

/** u/silver_anth's comment of May 2, 2019 in the thread. */
const PLAYER_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bjezpd/comment/emcwdmv/";

/** The author's comment of May 2, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bjezpd/comment/emb852k/";

/**
 * Quizchain block 73: the first Fibonacci numbers run together, as in The Da Vinci Code's vault
 * number, then TOMI, `Fibonacci` and the whole block 72 key, hashed with MD5 into BIP39 entropy,
 * for 10 mBTC. A player printed the WIF in the block 74 thread.
 */
export const quizchainBlock73 = bitcoinPuzzle({
  id: "quizchain/73",
  address: p2pkh("1FcQC5gHcSwaEYTV1C8t73gpBhv31WYPpt", "a043adb527b93010adfe376cc07424b94f5f0383"),
  sourceUrl: THREAD,
  startedAt: "2019-05-01 09:20:30",
  status: Status.Solved,
  pubkey: compressed("0394cd7d8b27d84fd3e0a1a14cd6cf342d6eacbedecf9cfb421fe5204200c8dec1"),
  key: wif("L4WrP5D7aDHDqhbrGZBqiXpae5jcLQbsahrM9oWHndz7XYVTuax5").entropy(
    "7debf7813cdfd613cdab9e619a8fe14a",
    source(THREAD, "MD5 of the number, TOMI, the name and the whole block 72 key"),
  ),
  prize: 0.01,
  hints: [
    official("Question: Looking for a 10 digit number.", THREAD, undefined, {
      answer: answer("Solution was the Fibonacci sequence 1123581321.", THREAD),
    }),
    official("Format:[solution] TOMI [TOMI] [link]", THREAD, undefined, {
      answer: answer(
        "Solution: 1123581321 TOMI Fibonacci L1NvACvyh4cNS5mTM4k8PnJphdBcdBWrU1EzcPZttaj9UHWD2xAT",
        PLAYER_COMMENT,
      ),
    }),
    official("Surviving longer than expected. Let's try a hint: Mona LIsa.", AUTHOR_COMMENT),
  ],
  solvedAt: "2019-05-02 13:33:18",
  solveTime: 101_568,
  transactions: [
    funding(
      "2d75d694fe065dfa02e57a2e95412efd2c11ed7f3f8fea09b45cef5deb377f6d",
      "2019-05-01 09:20:30",
      0.01,
    ),
    claim(
      "579a0b537f87a3e68dee38a23eaeec25053e384ef5c0aee377cb6a0d7809caf5",
      "2019-05-02 13:33:18",
      0.00990796,
    ),
  ],
});
