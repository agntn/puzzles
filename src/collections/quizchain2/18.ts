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

/** The block 18 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/bt7mfm/7_mbtc_quizchain2_block_18/";

/** Quizchain2 block 18: `6.25 TOMI Halvening` for the question `Third.` */
export const quizchain2Block18 = puzzle({
  id: "quizchain2/18",
  chain: "bitcoin",
  address: "1CoKBUPvFLYqveXHdDH9myVfy1JJUzhUKU",
  sourceUrl: THREAD,
  startedAt: "2019-05-25 12:15:21",
  status: Status.Solved,
  pubkey: compressed("0392c3fa070d340d728d05709f9d4ab3044460e3d3df7c46a173b9172314c37705"),
  key: wif("L5UUv9E62y1T4hEwwN5qFQEsieTLAyeCukPiRcwDtUyzMcBzKL6g")
    .entropy(
      "8e9fa5f8ab8ee60b581353cb199f332b",
      source(THREAD, "MD5 of the number, TOMI and one word"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Third.", THREAD, undefined, {
      answer: answer("TOMI field was Halvening, the number 6.25.", THREAD),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD),
    official("Solution is a number. TOMI field is one word, first letter only in Capital.", THREAD),
    official("First three digits of MD5 hash are 8e9.", THREAD),
    official("First digit of solution only MD5 hash is d.", THREAD),
    official("FIrst digit of TOMI field only MD5 hash is 0.", THREAD),
  ],
  solvedAt: "2019-05-26 16:52:37",
  solveTime: 103_036,
  transactions: [
    funding(
      "469418b9fa29d9e6c20b42ebbe39ff8bbe092d43e03a98560b81f791aa351c42",
      "2019-05-25 12:15:21",
      0.007,
    ),
    claim(
      "36a6a0b1e39b4f2004d89be3aa813f1b23e33bceb99c650bd1109d53a802c81d",
      "2019-05-26 16:52:37",
      0.0069,
    ),
  ],
});
