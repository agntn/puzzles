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

/** Where the question and the funding txid of block 60 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bgboz8/7_mbtc_blockchain_block_60/";

/**
 * Quizchain block 60: Voldemort's real name, TOMI, `He who must not be named` and the whole block
 * 59 key, hashed with MD5 into BIP39 entropy. The author's update puts a period after the six
 * words. The format says none, and the funded hash has none. No source printed the hash or the key.
 */
export const quizchainBlock60 = puzzle({
  id: "quizchain/60",
  chain: "bitcoin",
  address: "1LDUFfbWmgU2ht11mr8kpPDHiQ4JktqaeQ",
  sourceUrl: THREAD,
  startedAt: "2019-04-23 01:33:59",
  status: Status.Solved,
  pubkey: compressed("038a92cf0f4c4c1ceb88f27a931dc1ce520bdcdb862500aef85cf6ad23d7676eb1"),
  key: wif("KxWFLHnTW1KHkNhMLSdMHSANLEGvQXXrtYqESzcXjmLQg8x2NiaJ")
    .entropy(
      "afd904892b11ba42a5174297f1b617a4",
      source(THREAD, "MD5 of the name, TOMI, six words and the whole block 59 key"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official(
      "Question: Satoshi's real identity (don't tell anyone if you found it).",
      THREAD,
      undefined,
      {
        answer: answer("Tom Marvolo Riddle TOMI He who must not be named. [link].", THREAD),
      },
    ),
    official("Format for [TOMI] is six words, normal capitalization, no period at end.", THREAD),
    official(
      "Format for [link] is complete private key from previous block (59), not only last seven digits.",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-23 13:44:55",
  solveTime: 43_856,
  transactions: [
    funding(
      "493102053f9ade8f282b15f5dfdc9cad99e3203e986dd96236dcd72e7b9ec5cb",
      "2019-04-23 01:33:59",
      0.007,
    ),
    claim(
      "b7d805e76459cf1ec3b937a7e5a55f13cbcf9343c7c95080143e37d37e44231d",
      "2019-04-23 13:44:55",
      0.0065,
    ),
  ],
});
