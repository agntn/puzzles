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

/** The block 62 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/cag7u1/7_mbtc_quizchain2_block_62/";

/** Quizchain2 block 62: `Tanabata`, the Japanese festival of July 7, behind the question `77`. */
export const quizchain2Block62 = puzzle({
  id: "quizchain2/62",
  chain: "bitcoin",
  address: "1FPi8gMKZLD61dU3Zeb9vrwDc6yXpg4Ff7",
  sourceUrl: THREAD,
  startedAt: "2019-07-07 23:36:04",
  status: Status.Solved,
  pubkey: compressed("0213ff8008f9ee03bd71ee0c7e6b0fe9729cbfc9543f3f238f092783ecb6d874ff"),
  key: wif("KwvhXWUQG4Gg3S3TomjZh68Qq48AEAj6huCWWqMwC17ztmAPgJse")
    .entropy("bf472225686e7f9edca7e4c79fcc3cbb", source(THREAD, "MD5 of the one word"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: 77", THREAD, undefined, {
      answer: answer(
        "Solution was Tanabata, which is the name of the festival held on July 7 in Japan.",
        THREAD,
      ),
    }),
    official("Format: (solution)", THREAD),
    official("First three digits of MD5 hash are bf4.", THREAD),
  ],
  solvedAt: "2019-07-08 04:44:50",
  solveTime: 18526,
  transactions: [
    funding(
      "1789a6b33846d93c8d0859377cd659d8196e2a6c10b4db816c83fe76e516557f",
      "2019-07-07 23:36:04",
      0.007,
    ),
    claim(
      "d79d063f2c653692f3299250fa61dadf985e375a6c24762b9770328fc4f403db",
      "2019-07-08 04:44:50",
      0.00621357,
    ),
  ],
});
