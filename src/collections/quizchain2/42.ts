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

/** The block 42 thread, with the funding txid, the hash digits, the seven hints and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c1xhjo/7_mbtc_quizchain2_block_42/";

/** u/martypyouknowme's comment with the whole winning string, the solution as the hash wants it. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/c1xhjo/comment/ergbrxb/";

/** Quizchain2 block 42: `the solution to which will of course be "42"`, a line from the first run's block 41, with `block 41` in the TOMI field. */
export const quizchain2Block42 = puzzle({
  id: "quizchain2/42",
  chain: "bitcoin",
  address: "13orvovfAkY4vmWLQv1RaJfAXiPM1cW1Ke",
  sourceUrl: THREAD,
  startedAt: "2019-06-17 23:55:00",
  status: Status.Solved,
  pubkey: compressed("028fd1c75ae7daeb21fc0d1f1ab575f022f2aee3cee40077a2300375b6ebd4766e"),
  key: wif("L1BTKtsa43ELpcFudMX5hbFvSAFSFR9dAaTHYkEnnhrHftewyv5w")
    .entropy(
      "becddc56d92e2dd650403dc0eaa3b24e",
      source(PLAYER_COMMENT, "MD5 of the nine words, TOMI and two items"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", PLAYER_COMMENT)],
  prize: 0.007,
  hints: [
    official('Hint 1: "42"', THREAD, undefined, {
      answer: answer(
        "The idea was simply to have once more the solution posted before the block and this solution string was from block 41 of the first run, like the first time I tried this.",
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer('the solution to which will of course be "42" TOMI block 41', PLAYER_COMMENT),
    }),
    official("First three digits of MD5 hash are bec.", THREAD),
    official("Hint 2: TOMI field is two items", THREAD),
    official("Hint 3: solution is part of solution", THREAD),
    official(
      "Hint 4: I can't get away with posting the literal exact solution before the block twice",
      THREAD,
    ),
    official("Hint 5: Or can I?", THREAD),
    official("Hint 6: Nine items in solution.", THREAD),
    official("Hint 7 (last one): TOMI field is block 41.", THREAD),
  ],
  solvedAt: "2019-06-18 04:36:11",
  solveTime: 16_871,
  transactions: [
    funding(
      "ab5e3574025debb7bec7701aadeb487697f19e647976f62e38d4373819522057",
      "2019-06-17 23:55:00",
      0.007,
    ),
    claim(
      "bda242d4f6b539ac8c2a69c3358997ba88c6c01108283d137ec2789bd0a25d77",
      "2019-06-18 04:36:11",
      0.00677174,
    ),
  ],
});
