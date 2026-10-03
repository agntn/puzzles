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

/** The block 58 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c8xwgt/7_mbtc_quizchain2_block_58/";

/** u/Randomiser's comment with the winning sentence. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/c8xwgt/comment/esr21ua/";

/** Quizchain2 block 58: `That means a lot coming from you, Hal.`, Satoshi's reply to Hal Finney. */
export const quizchain2Block58 = puzzle({
  id: "quizchain2/58",
  chain: "bitcoin",
  address: "1ExTyMrA43mFJukabSCicdjdgG5ZJ2y2R9",
  sourceUrl: THREAD,
  startedAt: "2019-07-03 23:36:04",
  status: Status.Solved,
  pubkey: compressed("035b0265f559a57e5c5ef37d385fc9f8d4537ee35183d568b244e0d048d7c4f7a7"),
  key: wif("KxQHHCrCXDXEDCFvEop32srqFzmKseK8ofaf5uxdddPGZuYYnEgY")
    .entropy("a2ad440e71697e83075c4f1fcc2dd4b2", source(THREAD, "MD5 of the sentence"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: coming from you", THREAD, undefined, {
      answer: answer(
        'Solution was "That means a lot coming from you, Hal.", which I found remarkable (and amusing in the irony involved) as one instance of Hal talking to himself.',
        THREAD,
      ),
    }),
    official("Format: [solution]", THREAD, undefined, {
      answer: answer(
        'As someone else already noted the answer was "That means a lot coming from you, Hal." as posted by Satoshi.',
        PLAYER_COMMENT,
      ),
    }),
    official("First three digits of MD5 hash are a2a.", THREAD),
  ],
  solvedAt: "2019-07-04 04:07:03",
  solveTime: 16_259,
  transactions: [
    funding(
      "a926226f9861bc18c0e9361f194f0b0d7345591f7cbe015c5eb0f57316f39766",
      "2019-07-03 23:36:04",
      0.007,
    ),
    claim(
      "223cc1c6cb05ba08cfdce7629dbcd945e5834db091f5305d4f010d0ff5940984",
      "2019-07-04 04:07:03",
      0.00682048,
    ),
  ],
});
