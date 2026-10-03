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

/** The block 44 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c2volp/7_mbtc_quizchain2_block_44/";

/** Quizchain2 block 44: `good solution`, a stand-in for the satisfaction of a Rolling Stones song, with no TOMI field. */
export const quizchain2Block44 = puzzle({
  id: "quizchain2/44",
  chain: "bitcoin",
  address: "14Pm4c2h4vxf4gV1MP3rYGY293km6dpiP8",
  sourceUrl: THREAD,
  startedAt: "2019-06-20 07:21:19",
  status: Status.Solved,
  pubkey: compressed("031877dfc75d197dc557916d0b646c5182da9dd27140f97db329485f1fbf1dc270"),
  key: wif("KzGXbUuHWqjgz2fo22ti5dy35Lz126UdXeurijEf7WDWGLqXAeif")
    .entropy("fd85fcee491c68b8dd9a0ce9ae791b8a", source(THREAD, "MD5 of the two words"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: https://youtu.be/nrIPxlFzDi0", THREAD, undefined, {
      answer: answer(
        'Solution was to find something to substitute for "satisfaction". I thought "good solution" was a nice fit.',
        THREAD,
      ),
    }),
    official("Format: [solution].", THREAD),
    official("No TOMI field needed for this one.", THREAD),
    official("First three digits of MD5 hash are fd8.", THREAD),
  ],
  solvedAt: "2019-06-20 16:06:55",
  solveTime: 31_536,
  transactions: [
    funding(
      "0f5625ab5a298733d4ac73dc0c77f3753e34dd08cdd56d4b1837f1c27fb86897",
      "2019-06-20 07:21:19",
      0.007,
    ),
    claim(
      "6ad4ed03389fc2991aa79a7835d188f886bf20288c2d60a1c30805b704ab05df",
      "2019-06-20 16:06:55",
      0.00681626,
    ),
  ],
});
