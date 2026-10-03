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

/** The block 51 thread, with the format, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c5xj38/7_mbtc_quizchain2_block_51/";

/** Quizchain2 block 51: `51 percent attack`, no question and no TOMI field, claimed in the funding block. */
export const quizchain2Block51 = puzzle({
  id: "quizchain2/51",
  chain: "bitcoin",
  address: "17EPFGMydd2suYjbNShHrFYzj41JGUHTVa",
  sourceUrl: THREAD,
  startedAt: "2019-06-26 23:04:41",
  status: Status.Solved,
  pubkey: compressed("023b2309ea51d72b7147959bd21f5b90f185570e2dc4427420bd34f3e932f6cf5f"),
  key: wif("Kx5RaMi7KbKxouzMdEoszZDuGfLnn8aNEAx1xE8CJrsxBZGkStyY")
    .entropy("4c4cdbf69c62f3bf2dc68ab5400f8669", source(THREAD, "MD5 of the number and two words"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Format: [solution]", THREAD, undefined, {
      answer: answer(
        'Solution was simply "51 percent attack" and winner explained in comments that he already anticipated that, so the only time he needed was to run the Coleman tool.',
        THREAD,
      ),
    }),
    official("First three digits of MD5 hash are 4c4.", THREAD),
  ],
  solvedAt: "2019-06-26 23:04:41",
  solveTime: 0,
  transactions: [
    funding(
      "424a3f6ba6573baba805b363819975993adf6f6cb1c20949baf8efbe510d2eab",
      "2019-06-26 23:04:41",
      0.007,
    ),
    claim(
      "7eb91088189d1a511408f316bb6e3bf06e773b27dbcd6c152370c457b95f0f5c",
      "2019-06-26 23:04:41",
      0.00664634,
    ),
  ],
});
