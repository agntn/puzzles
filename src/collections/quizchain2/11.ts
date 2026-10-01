import {
  answer,
  claim,
  compressed,
  funding,
  official,
  p2pkh,
  source,
  wif,
} from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

/** The block 11 thread, with the format, the funding txid, the hash digits and the solution. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bqqiot/7_mbtc_quizchain2_block_11/";

/** u/BrainForceOne's comment with the spacing of the winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bqqiot/comment/eobz5fy/";

/** Quizchain2 block 11: one space, TOMI and `one space`. Nobody printed the hash or the key. */
export const quizchain2Block11 = bitcoinPuzzle({
  id: "quizchain2/11",
  address: p2pkh("14wH4M6Ej19LM5h6BxAQMVdD1ba86SPSsv", "2b2c3e5b1ce846ed38f87a54ded489be1d60b03a"),
  sourceUrl: THREAD,
  startedAt: "2019-05-19 12:52:01",
  status: Status.Solved,
  pubkey: compressed("02455a7f030dfb2770ffdda9db09d2a0a0041594bd418d8f0b164e97fb24d02cdc"),
  key: wif("KyjAP9JR7pn5Bz98cqyp3PZNpdnw2nGzotA2enpTrT5trNQ5GoEF")
    .entropy(
      "057e2b3773eafe634f5b769161e920cb",
      source(THREAD, "MD5 of one space, TOMI and two words"),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official(
      "This will be a simple block similar to block 11 of the first round with a very simple solution. It will be so simple and obvious that I don't even need a question for the block.",
      THREAD,
      undefined,
      {
        answer: answer(
          'Starting from nothing, the two alternatives are one space and one line break. For this block I chose the first alternative, with "one space" as the TOMI field.',
          THREAD,
        ),
      },
    ),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer(
        "Got it. There is one space for solution and one space before TOMI.",
        PLAYER_COMMENT,
      ),
    }),
    official("FIrst three digits of MD5 hash are 057.", THREAD),
    official("MD5 hash of solution only is 7.", THREAD),
    official("MD 5 hash of TOMI field only is 1.", THREAD),
  ],
  solvedAt: "2019-05-21 11:21:51",
  solveTime: 167_390,
  transactions: [
    funding(
      "95f7f474d73310fc53748a17c20abc03e592ac557dc96f438c550a37fc0be23e",
      "2019-05-19 12:52:01",
      0.007,
    ),
    claim(
      "a06ea1010916a65effb31875a50405be93a567021cda21059af3d41cfcae9734",
      "2019-05-21 11:21:51",
      0.00668294,
    ),
  ],
});
