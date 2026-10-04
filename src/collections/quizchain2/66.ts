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

/** The block 66 thread, with the question, the funding txid, the hash digits, the hint and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/cc5uka/7_mbtc_quizchain2_block_66/";

/** u/Randomiser's comment with the solution and where it came from. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/cc5uka/comment/etnllvl/";

/** Quizchain2 block 66: the block 63 hint sentence about the author, cut down to one sentence with a period. */
export const quizchain2Block66 = puzzle({
  id: "quizchain2/66",
  chain: "bitcoin",
  address: "1Lrh5pgaaKXdWC9u5bzp9ogsNktjPWJMij",
  sourceUrl: THREAD,
  startedAt: "2019-07-11 23:14:21",
  status: Status.Solved,
  pubkey: compressed("028b06cd25a5f2a17be760c8dd54a6e8d8e6bb2b2c2ede633d60b479872fd98dea"),
  key: wif("KyR2KVqfhwQ7gSdx1ZVNouVHzePw7BeqPewQ5TWti9d2dxDEDwxm")
    .entropy("dc59555d015d2793e7750188cad161ba", source(THREAD, "MD5 of the sentence"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Aoi", THREAD, undefined, {
      answer: answer(
        'solution was from the hint in block 63 "A young woman of Japanese ancestry who is very smart and sincere."',
        THREAD,
      ),
    }),
    official(
      "Format: [solution]. No comma in solution, but one period after it.",
      THREAD,
      undefined,
      {
        answer: answer(
          'It was taken from the hint from block 63: "A young woman of Japanese ancestry who is very smart and sincere."',
          PLAYER_COMMENT,
        ),
      },
    ),
    official("First three digits of MD5 hash are dc5.", THREAD),
    official(
      "Solution is one sentence without comma and a period at the end to describe me.",
      THREAD,
    ),
  ],
  solvedAt: "2019-07-13 04:07:02",
  solveTime: 103961,
  transactions: [
    funding(
      "58b9cb448f10f76d49f1db501ebb0ef49df2cbab3df402a20416eb524116ea70",
      "2019-07-11 23:14:21",
      0.007,
    ),
    claim(
      "375a563c2a2783d310945277b1070c02441d794e1b5ef5429ff3cd40b968daf3",
      "2019-07-13 04:07:02",
      0.00683795,
    ),
  ],
});
