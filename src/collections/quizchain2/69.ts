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

/** The block 69 thread, with the question, the funding txid, the hash digits, the partial hashes and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/cdentq/7_mbtc_quizchain2_block_69/";

/** u/puzzleponky's comment with the solution and the repeated TOMI hash. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/cdentq/comment/ettxmsb/";

/** Quizchain2 block 69: `madam`, the polite answer to `sir`, with the block 68 TOMI field `palindrome` again. */
export const quizchain2Block69 = puzzle({
  id: "quizchain2/69",
  chain: "bitcoin",
  address: "17rkDa7xXHuK1TyzHExcj9e229ooKef8yU",
  sourceUrl: THREAD,
  startedAt: "2019-07-15 04:30:01",
  status: Status.Solved,
  pubkey: compressed("03eb2885cba1c58a2ba61f895b552ad1058b2246909ef98e744e27342eaf823da3"),
  key: wif("L326eHtxFCNJ3B1s152SfuhpGxzwBbsEGpfyGmt5CnX7YjbMGUxg")
    .entropy("a8f7e33a0aaeb16f61a5b09cff038846", source(THREAD, "MD5 of the word, TOMI and a word"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official('Question: "Waste of time, sir."', THREAD, undefined, {
      answer: answer('Solution was "madam" and TOMI field was again "palindrome".', THREAD),
    }),
    official("Anyway, format for this block is: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer('full solution is: "madam TOMI palindrome"', PLAYER_COMMENT),
    }),
    official("First three digits of MD5 hash are a8f.", THREAD),
    official(
      "Update: Block has survived for 5 hours now, so here are partial hashes. For solution only first two digits are be, for TOMI field only they are 07.",
      THREAD,
    ),
  ],
  solvedAt: "2019-07-15 13:51:25",
  solveTime: 33684,
  transactions: [
    funding(
      "2411287307338fd0882d3827319af6574725e5c637396669eeb18242a163add7",
      "2019-07-15 04:30:01",
      0.007,
    ),
    claim(
      "6e56bb4c0df5d645030c67f52fce239e9f0eb2b27f868b344618ee85ffa9031b",
      "2019-07-15 13:51:25",
      0.00685965,
    ),
  ],
});
