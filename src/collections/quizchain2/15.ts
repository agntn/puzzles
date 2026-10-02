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

/** The block 15 thread, with the question, the funding txid and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/bscc8b/7_mbtc_quizchain2_block_15/";

/** Quizchain2 block 15: `TOMI` alone, funded two days before the post as a bot test. */
export const quizchain2Block15 = puzzle({
  id: "quizchain2/15",
  chain: "bitcoin",
  address: "1BQkqXXsrDrjbDk8KXkXoxzj8jjfUzvXD6",
  sourceUrl: THREAD,
  startedAt: "2019-05-22 04:19:33",
  status: Status.Solved,
  pubkey: compressed("0206ca3e9669dec22a101dbf7909ef8d1327dfe3893db43db1b75d37a7ce40b704"),
  key: wif("KxKmRVBkqQESJrVAxLmHuQPtFJA2dbfwxM3pUs27W5C238Mri75N")
    .entropy("ae36a5a194f8daca9f3034d8ca6a3947", source(THREAD, "MD5 of the one word"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Thinking only method.", THREAD, undefined, {
      answer: answer("Solution was TOMI. And that was all.", THREAD),
    }),
    official("Format: [solution]", THREAD),
  ],
  solvedAt: "2019-05-24 04:07:01",
  solveTime: 172_048,
  transactions: [
    funding(
      "6b42515fd718adb197f25592b2f087eab7516b13479f09164a33ddfa544b0fd4",
      "2019-05-22 04:19:33",
      0.007,
    ),
    claim(
      "70efea2e43b3281138e6ae2ecfb2ae7acdcea3119cfb3482bee5c6cb4847f155",
      "2019-05-24 04:07:01",
      0.0048,
    ),
  ],
});
