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

/** The block 47 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c3vye3/11_mbtc_quizchain2_block_47/";

/** u/silver_anth's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/c3vye3/comment/ertjwdh/";

/** Quizchain2 block 47: `21`, the cross sum of 115257, with `cross sum` in the TOMI field. */
export const quizchain2Block47 = puzzle({
  id: "quizchain2/47",
  chain: "bitcoin",
  address: "1N2niQ6254HESHab6YTSgUL1suyTLWjMeA",
  sourceUrl: THREAD,
  startedAt: "2019-06-22 12:40:59",
  status: Status.Solved,
  pubkey: compressed("024e03c3f7011b1637187744150c73e7332a07bd1d4f60dd6285751b781bf69184"),
  key: wif("L3siinurst6gR8nJQmjqm4UXEQxZjQ5aosXBVBqxTnfzDoL38nNY")
    .entropy(
      "f259fd354a72768507eb9d8d180c367a",
      source(THREAD, "MD5 of the number, TOMI and two words"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.011,
  hints: [
    official("Question: 115257", THREAD, undefined, {
      answer: answer('Solution was "21" and TOMI field was "cross sum".', THREAD),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("21 TOMI cross sum", PLAYER_COMMENT),
    }),
    official("First three digits of MD5 hash are f25.", THREAD),
  ],
  solvedAt: "2019-06-22 23:32:32",
  solveTime: 39_093,
  transactions: [
    funding(
      "2965f73dd4f6acf94a19767fc53378d46855f985addcca6967d54b536cbb50ce",
      "2019-06-22 12:40:59",
      0.011,
    ),
    claim(
      "d32b5115bb55ef17a45822df3cbf11bb4ab2839e71bd86e9556a99b8a2d8ad1f",
      "2019-06-22 23:32:32",
      0.01095968,
    ),
  ],
});
