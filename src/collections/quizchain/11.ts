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

/** Where the question and the funding txid of block 11 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bb2vwf/expert_7_mbtc_quizchain_block_11/";

/**
 * Quizchain block 11: the question itself, copied as posted, with the last three characters of the
 * block 10 key appended, hashed with SHA-256 into BIP39 entropy. The post billed it as expert, and
 * the author's update gives the string away. The update misspells whatsoever. The funded hash does
 * not. A player printed the WIF in the block 21 thread.
 */
export const quizchainBlock11 = puzzle({
  id: "quizchain/11",
  chain: "bitcoin",
  address: "1156YWRc9MYTEcZBkz91FyjNdN6QyRtmvJ",
  sourceUrl: THREAD,
  startedAt: "2019-04-09 03:04:33",
  status: Status.Solved,
  pubkey: compressed("029de3b565c4ebc174a83688208e8afede2ea5f40bd57896d727c9742147c0a19e"),
  key: wif("L3qP93VXiHtTzwpUCv6BNKApBnneg1LjajeenEND2Cx5BNALJgFm").entropy(
    "4fd06cd3118515483504684b9fadbdb2aa65c79501dd8d6c396efe5961f5e6ac",
    source(
      THREAD,
      "SHA-256 of the question as posted with the last three characters of the block 10 key appended",
    ),
  ),
  techniques: [technique("sha256-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Can you find the solution with absolutely no hint whatsoever?", THREAD, undefined, {
      answer: answer(
        'Just take the question as it was and add the previous block private key digits, which results in "Can you find the solution with absolutely no hint whatsover?peH" as the string to hash.',
        THREAD,
      ),
    }),
    official(
      "And the last three digits of the private key for the previous block (not yet solved) are peH.",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-09 03:45:26",
  solveTime: 2453,
  transactions: [
    funding(
      "71970cfaeb5a27cc1a6e5dd3f7a899582e064105863919f012eb7b431e48b9b4",
      "2019-04-09 03:04:33",
      0.007,
    ),
    claim(
      "7f94a37263db22674693db3c0a3eb2dea4dec4a07919b900b77ef1aab668eba5",
      "2019-04-09 03:45:26",
      0.0069,
    ),
  ],
});
