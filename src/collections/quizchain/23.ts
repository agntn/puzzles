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

/** Where the question and the funding txid of block 23 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bbv6er/impossible_now_easy_later_7_mbtc_quizchain_block/";

/** u/JDScreesh's comment of July 23, 2019 in the thread. */
const PLAYER_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bbv6er/comment/eui879d/";

/**
 * Quizchain block 23: the end of a sentence from the final version of the Wattpad chapter Second, a
 * space and the last three characters of the block 22 key, hashed with MD5 into BIP39 entropy. Like
 * block 13 it was unsolvable on purpose, and the post printed this key's tail, `mph`, to keep the
 * chain going. It fell in July 2019. A player then printed the string, the hash and the WIF.
 */
export const quizchainBlock23 = bitcoinPuzzle({
  id: "quizchain/23",
  address: p2pkh("1Ee9S6mv2XWhfzTmocc3twpo6kyuS3BsXz", "95a010a92bf203c63344f7e8a8c46dd9d6e3313b"),
  sourceUrl: THREAD,
  startedAt: "2019-04-11 02:55:35",
  status: Status.Solved,
  pubkey: compressed("02d1501e28174fa0d7d6457b95876ae201c567877827094fb69b202ca69258615a"),
  key: wif("KyJLiBVQgY76wvHiSKv2hCRqA2W3bD29PUmHYXJj4KiBcbuammph").entropy(
    "94e9e006cceb549d3ff0e6e70eec1bb9",
    source(
      THREAD,
      "MD5 of the sentence's end from the final Wattpad chapter Second, a space and the last three characters of the block 22 key, printed by a player with the key",
    ),
  ),
  prize: 0.007,
  hints: [
    official(
      "Question: Complete the following sentence. We found out that this is the second [6 words and period missing].",
      THREAD,
      undefined,
      {
        answer: answer(
          "Solution of this block was: **climate emergency episode on this planet. CGD**",
          PLAYER_COMMENT,
        ),
      },
    ),
    official(
      "Format: [word1 word2 word3 word4 word5 word6.] [link] with exactly one space between solution and link.",
      THREAD,
    ),
    official(
      "Update after first run to block 77: This will be impossible to solve until the whole quizchain experiment finishes and I publish the final version of the hint to block 77 in the Wattpad story.",
      THREAD,
    ),
  ],
  solvedAt: "2019-07-22 23:56:43",
  solveTime: 8_888_468,
  transactions: [
    funding(
      "ed5b87f7037416f53c55871d3ee2303d48bb20184de7549b9c69f83068aa7b74",
      "2019-04-11 02:55:35",
      0.007,
    ),
    claim(
      "71d30fb4aceee87de70bb0627a5518a64ee94c42e9ecd490d66ddc022a26fc59",
      "2019-07-22 23:56:43",
      0.0066,
    ),
  ],
});
