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

/** The block 45 thread, with the question, the funding txid, the hash digits, the hint and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c37u67/7_mbtc_quizchain2_block_45/";

/** Quizchain2 block 45: `a)`, Hal Finney as Satoshi, with `timing of dropout` in the TOMI field. */
export const quizchain2Block45 = puzzle({
  id: "quizchain2/45",
  chain: "bitcoin",
  address: "1NbNe8TPBewoG31Rf5bCof9Wj1QY7LBeGX",
  sourceUrl: THREAD,
  startedAt: "2019-06-21 05:12:12",
  status: Status.Solved,
  pubkey: compressed("037ec64356e589c888bcd47a338b0e3a7e9cd4d5e0116c80a812c06a90683585d7"),
  key: wif("Kwdh6YGsDBk4A3CKyb9KVftYxR4usAv2YTUDtN3jzE7aSMx8xVJg")
    .entropy(
      "df1ae0a564ffed778bee08eb43a699b3",
      source(THREAD, "MD5 of the letter, TOMI and three words"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Satoshi's real identity is:", THREAD, undefined, {
      answer: answer(
        'Solved half a day after first hint, solution was of course a) and TOMI field was "timing of dropout".',
        THREAD,
      ),
    }),
    official("a) Hal Finney", THREAD),
    official("b) Nick Szabo", THREAD),
    official("c) Dorian Nakamoto", THREAD),
    official("d) Craig Wright", THREAD),
    official("Format: [solution] TOMI [TOMI]", THREAD),
    official("First three digits of MD5 hash are df1.", THREAD),
    official(
      "Solution format is only the letter, like this: a). TOMI field text is all lower case.",
      THREAD,
    ),
    official(
      "I already published the necessary background yesterday at the Wattpad story.",
      THREAD,
    ),
    official("Hint 1: TOMI field format is three words, all in lower case.", THREAD),
  ],
  solvedAt: "2019-06-22 20:34:30",
  solveTime: 141_738,
  transactions: [
    funding(
      "93be460b4a7332eb20783e42159fc2e6edf2585a13f7db31e89f1b9232c679f6",
      "2019-06-21 05:12:12",
      0.007,
    ),
    claim(
      "31d3f9aebee99880c2f15e1ec83df4c24f1569418fbfc7ef79776a53c146ddb9",
      "2019-06-22 20:34:30",
      0.006808,
    ),
  ],
});
