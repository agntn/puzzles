import { claim, compressed, funding, official } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The block 76 thread, with the question, the funding txid, the hash digits and the one hint. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/cgcv9i/77_mbtc_quizchain2_block_76/";

/** The author's one-word reply of August 3, 2019, when a player asked `"to" or "two"?`. */
const TO_NOT_TWO = "https://www.reddit.com/r/Grycoin/comments/cgcv9i/comment/evwxwvw/";

/** Quizchain2 block 76: `change to`, later `from change to`. Seven years unclaimed, then swept, and nobody has said how. */
export const quizchain2Block76 = puzzle({
  id: "quizchain2/76",
  chain: "bitcoin",
  address: "13Cv6SXUnzGDT8JHqzzJ8xMPtsSdhJA4wd",
  sourceUrl: THREAD,
  startedAt: "2019-07-22 03:12:48",
  status: Status.Claimed,
  pubkey: compressed("02291e71f75948c21e03c9a2faba367129f1a4e75086a780440e0d9b2a6213e0e9"),
  prize: 0.077,
  hints: [
    official("Question: change to", THREAD),
    official("Format: [solution] TOMI [TOMI]", THREAD),
    official("First three digits of MD5 hash are f8e (copypasted).", THREAD),
    official(
      "Update, posted after starting up new: First two digits of solution only are 1d.",
      THREAD,
    ),
    official('Hint 1. Change question from "change to" to "from change to".', THREAD),
    official("to", TO_NOT_TWO),
  ],
  solvedAt: "2026-08-17 09:31:23",
  solveTime: 223_193_915,
  transactions: [
    funding(
      "979670f3d1d4134e7989ed6f4a4370362e15c101711c93675790cf0751c8dbd4",
      "2019-07-22 03:12:48",
      0.077,
    ),
    claim(
      "2e271ac2f63f488cd14112bceeed56f159ecd98cb3ce753f08e2d94bb62714a3",
      "2026-08-17 09:31:23",
      0.0769981,
    ),
  ],
});
