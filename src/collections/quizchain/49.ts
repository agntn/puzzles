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

/** Where the question and the funding txid of block 49 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bel75n/7_mbtc_7_mbtc_7_mbtc_quizchain_blocks_48_to_50/";

/** The author's Wattpad chapter Complete Quizchain, with the question and solution of every first run block. */
const SOLUTIONS = "https://www.wattpad.com/720895205-second-complete-quizchain";

/** The author's comment of April 18, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bel75n/comment/el6orfx/";

/**
 * Quizchain block 49: `hat hot hit`, the vowels of Aoi in order, then BFUB, a fixed text and the
 * last seven characters of the block 48 key, hashed with MD5 into BIP39 entropy. No source printed
 * the hash or the key.
 */
export const quizchainBlock49 = puzzle({
  id: "quizchain/49",
  chain: "bitcoin",
  address: "1A2Z5k5DE1e8baSYLfkvXHbymLxCfvgUoq",
  sourceUrl: THREAD,
  startedAt: "2019-04-18 06:17:41",
  status: Status.Solved,
  pubkey: compressed("02dafcbc7148709c70022e632f5d03b2ad183780d16ac3f7ec8f466d79ffb53846"),
  key: wif("KzPd8rqVsewbA17eihdVX1v9qV2hcXjGDfYv2DWACqSZf6aeWgjN")
    .entropy(
      "3bc415094baf566889cc5bdafcaf5a41",
      source(
        THREAD,
        "MD5 of the three words, BFUB, the fixed text and the last seven characters of the block 48 key",
      ),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official(
      "Question: You are looking for three words. Those three words are all lowercase. And they must be in the correct order.",
      THREAD,
      undefined,
      {
        answer: answer("Solution: hat hot hit", SOLUTIONS),
      },
    ),
    official("Format: [word1 word2 word3] TOMI Good luck with this block [link]", THREAD),
    official("Change TOMI to BFUB when hashing.", AUTHOR_COMMENT),
    official(
      "[link] is last 7 digits from previous block private key, not 3, to make it harder to brute force a link.",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-18 20:04:04",
  solveTime: 49_583,
  transactions: [
    funding(
      "b911b08d4cfd3f682faa48ce4cc6e2e694fbf7e1e616972630372b4867d1024d",
      "2019-04-18 06:17:41",
      0.007,
    ),
    claim(
      "a66a762901f6065e1bedc225349efa19c6567631d3cd45ea6b647af723c446ac",
      "2019-04-18 20:04:04",
      0.00688792,
    ),
  ],
});
