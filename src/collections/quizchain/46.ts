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

/** Where the question and the funding txid of block 46 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bdrcj7/7_mbtc_7_mbtc_11_mbtc_quizchain_blocks_45_to_47/";

/** The author's Wattpad chapter Complete Quizchain, with the question and solution of every first run block. */
const SOLUTIONS = "https://www.wattpad.com/720895205-second-complete-quizchain";

/**
 * Quizchain block 46: the genesis block address, a fixed BFUB text and the last seven characters of
 * the block 45 key, hashed with MD5 into BIP39 entropy. Claimed less than a minute after block 45.
 * No source printed the hash or the key.
 */
export const quizchainBlock46 = puzzle({
  id: "quizchain/46",
  chain: "bitcoin",
  address: "1FAVdEyekXJu5o7Bx6QvVVnayYPq9fsPtv",
  sourceUrl: THREAD,
  startedAt: "2019-04-16 03:14:34",
  status: Status.Solved,
  pubkey: compressed("03abb6290e4fabfb1f72da1e3baac067d750d52afe78201e3251d30f6a0171ac98"),
  key: wif("KyUcwLpYRN72BjQbtT7job74DySaLS71PBfg71QMz4RKDadyH5bR")
    .entropy(
      "583d01edbdf81cc7494c85bcf506e991",
      source(
        THREAD,
        "MD5 of the genesis address, the fixed BFUB text and the last seven characters of the block 45 key",
      ),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official(
      "Looking for another Bitcoin address, starting with 1A1. Not mentioned by me before here or elsewhere. I do NOT own this address.",
      THREAD,
      undefined,
      {
        answer: answer(
          "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa (Genesis block address, also puzzle for block 77).",
          SOLUTIONS,
        ),
      },
    ),
    official("Format: [solution] BFUB Think. Think harder. [link]", THREAD),
    official(
      "Find solution, which is the Bitcoin address I am looking for, leave BFUB unchanged and use last 7 digits of previous private key for link.",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-16 19:15:35",
  solveTime: 57_661,
  transactions: [
    funding(
      "2900dfc636a5a9f8c3bbbc2f28dbd9c0fbc98b7d8c06c2e59de613c5f7dfa90a",
      "2019-04-16 03:14:34",
      0.007,
    ),
    claim(
      "526b428a52cbcc0a7c8426c3cdcf9727640d3344bd9885c549c3b77a4b458ed2",
      "2019-04-16 19:15:35",
      0.00690707,
    ),
  ],
});
