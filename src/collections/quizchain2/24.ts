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

/** The block 24 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/bv4rd2/7_mbtc_quizchain2_block_24/";

/** u/mooncritic's comment with the solution and the TOMI field. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/bv4rd2/comment/epl9678/";

/** Quizchain2 block 24: `RPOW`, Hal Finney's reusable proof of work. */
export const quizchain2Block24 = puzzle({
  id: "quizchain2/24",
  chain: "bitcoin",
  address: "1NfLgLWFiAiaHYCAAwPS3SFoXzgj4gSHdk",
  sourceUrl: THREAD,
  startedAt: "2019-05-31 08:06:13",
  status: Status.Solved,
  pubkey: compressed("02706ffd95ff84057a17e9238268bcd66cc025bce322dea403a785c8cf2ce3c04a"),
  key: wif("L5kQ9FUD14sYY3yevLHvEzME2wGbrMUvgDBvMHQotLg2cayRswM1")
    .entropy(
      "537fbb6227b801381fc2a2120a5d81f2",
      source(THREAD, "MD5 of the acronym, TOMI and three words"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Reusable", THREAD, undefined, {
      answer: answer(
        'Solution was "RPOW", which is "Reusable proof of work", a previous attempt to build private Internet cash. TOMI was just "proof of work".',
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer(
        "I solved this one. Solution is RPOW, and TOMI is proof of work.",
        PLAYER_COMMENT,
      ),
    }),
    official("First three digits of MD5 hash are 537.", THREAD),
    official("First digit of solution only MD5 hash is 9.", THREAD),
    official("First digit of TOMI field only MD5 hash is a.", THREAD),
  ],
  solvedAt: "2019-05-31 08:06:13",
  solveTime: 0,
  transactions: [
    funding(
      "0cd1e2725bb02d1aee1d19134d41352ded5f8b9492b7223af5b273982d5a8047",
      "2019-05-31 08:06:13",
      0.007,
    ),
    claim(
      "1b18856ca5b7eea502d715b58290d635007015c203b93c2fff78a8a9465fefd9",
      "2019-05-31 08:06:13",
      0.00651087,
    ),
  ],
});
