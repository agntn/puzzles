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

/** The block 64 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/cbgf21/7_mbtc_quizchain2_block_64/";

/** Quizchain2 block 64: `QWERTY`, six letters that start where Atbash turns `JD` into `QW`. */
export const quizchain2Block64 = puzzle({
  id: "quizchain2/64",
  chain: "bitcoin",
  address: "1HhtnrYdbu6n6BYMuLu4FK1CvCMWeZoFQA",
  sourceUrl: THREAD,
  startedAt: "2019-07-10 11:04:59",
  status: Status.Solved,
  pubkey: compressed("036e1a9394cc9f0ffe31f8048d4bd1d6f5cf53d2c1ee38fe3b878a4dca3879130c"),
  key: wif("L3Hj2G6FMatruJkncaNyaXGRhec61jFcXhS753nwUQPyhHZfptmU")
    .entropy("2154d8826f5789ddf09aa1e226d89bfa", source(THREAD, "MD5 of the word, TOMI and a word"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD), technique("atbash", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: JD6", THREAD, undefined, {
      answer: answer(
        "The solution required to use Atbash on the JD part, which results in QW, then note that the popular QWERTY format has six letters. QWERTY was the solution.",
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer(
        'TOMI was "keyboard", but I have no idea how much resistance that provided to robots.',
        THREAD,
      ),
    }),
    official("TOMI field is one word in lower case.", THREAD),
    official("First three digits of MD5 hash are 215 (copypasted).", THREAD),
  ],
  solvedAt: "2019-07-10 23:17:02",
  solveTime: 43923,
  transactions: [
    funding(
      "650dfa0f8a43f4e315a3fc8bbfa5b501fde0314618049bec859b820d94be27a4",
      "2019-07-10 11:04:59",
      0.007,
    ),
    claim(
      "19da61a320921e5c05ef3d7af119c7aec9cc56517d2c2103c99288e233cb0c0d",
      "2019-07-10 23:17:02",
      0.00679398,
    ),
  ],
});
