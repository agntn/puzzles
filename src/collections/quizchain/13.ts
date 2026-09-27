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

/** Where the question and the funding txid of block 13 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bb4c7q/impossible_for_now_7mbtc_quizchain_unlucky_block/";

/** u/userm1010110's comment of July 23, 2019 in the thread. */
const PLAYER_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bb4c7q/comment/eujdj25/";

/** The author's Wattpad chapter Complete Quizchain, with the question and solution of every first run block. */
const SOLUTIONS = "https://www.wattpad.com/720895205-second-complete-quizchain";

/**
 * Quizchain block 13: the first seven words of the hint to block 77, which turned out to be the
 * final version of the Wattpad chapter Second, headings included, with the last three characters of
 * the block 12 key, hashed with SHA-256 into BIP39 entropy. The author made it unsolvable on
 * purpose and printed this key's tail, `xhm`, so the chain could go on. It fell in July, when the
 * chapter was final. A player posted the full string after the claim. No source printed the hash or
 * the key.
 */
export const quizchainBlock13 = bitcoinPuzzle({
  id: "quizchain/13",
  address: p2pkh("1GJPyUZvBE8MewEZyRx999p5JbVy8wbmWE", "a7d422b66e5e79f0175b7fe9f8aebb3d4c617deb"),
  sourceUrl: THREAD,
  startedAt: "2019-04-09 05:44:42",
  status: Status.Solved,
  pubkey: compressed("031345c828e3646d1a913b0ae44df951bb5549d4648bc516aee76483dc1dcb45ba"),
  key: wif("KznoygsYZth6yY6mmZxKcF3bgEi24kyTFSwMEw89Bm8DWdrqHxhm")
    .entropy(
      "2a799f952abe95d13bdeea53ba5a9e075178b751bf16ccd75ddbed0aea9afc14",
      source(
        THREAD,
        "SHA-256 of the first seven words of the final Wattpad chapter Second, headings included, with the last three characters of the block 12 key, as a player published it",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official(
      "Question: What are the first seven words in the hint to block 77? Format: word1 word2 word3 word4 word5 word6 word7 xXJ.",
      THREAD,
      undefined,
      {
        answer: answer("Second Second Life Second Coming I thought xXJ", PLAYER_COMMENT),
      },
    ),
    official(
      "Update: It will be impossible until the whole experiment ends, which will be shortly after the second run to block 77 finishes.",
      THREAD,
    ),
    official("Impossible to solve without final version of Chapter 2 of this story.", SOLUTIONS),
  ],
  solvedAt: "2019-07-23 07:09:48",
  solveTime: 9_077_106,
  transactions: [
    funding(
      "3ad89ff0f48bfba17b28dedd5972a69bd3ac8acc73816048ab3ee566b71c1849",
      "2019-04-09 05:44:42",
      0.007,
    ),
    claim(
      "7ec179b405afe98e97c7e6d0d393301bbfeed8d73d445d801c8f9b4af242750e",
      "2019-07-23 07:09:48",
      0.00685984,
    ),
  ],
});
