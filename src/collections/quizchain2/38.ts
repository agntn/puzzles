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

/** The block 38 thread, with the question, the funding txid, the hint and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c0cq0b/7_mbtc_quizchain2_block_38/";

/** u/Randomiser's comment with the whole winning string, the TOMI field as the hash wants it. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/c0cq0b/comment/er6u1h4/";

/** Quizchain2 block 38: `ACE`, the first three odd numbered letters, with `odd numbered alphabet letters` in the TOMI field. */
export const quizchain2Block38 = puzzle({
  id: "quizchain2/38",
  chain: "bitcoin",
  address: "1HsXSQHfNeNVrGqaRBgB7p354pbK8ffYXS",
  sourceUrl: THREAD,
  startedAt: "2019-06-13 13:09:02",
  status: Status.Solved,
  pubkey: compressed("035eda54af194001681f0de125f6855ff5fc413dbefc70531e21d9058eb874e030"),
  key: wif("L567ZDaTVYojFcuxjbHAXrfzjGhDHXgWnSom2V8ZHr3dJj5AB1A2")
    .entropy(
      "4f0d5c65e568de8d2de1baae150e40f9",
      source(PLAYER_COMMENT, "MD5 of the word, TOMI and four words"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", PLAYER_COMMENT)],
  prize: 0.007,
  hints: [
    official("Question: odd", THREAD, undefined, {
      answer: answer(
        'Solution was ACE and TOMI field was "odd numbered alphabet numbers".',
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("ACE TOMI odd numbered alphabet letters", PLAYER_COMMENT),
    }),
    official(
      "Solution is a word in all capitals like [WORD]. TOMI field are four words, all in lower case like [word1] [word2] [word3] [word4].",
      THREAD,
    ),
    official("FIrst three digits of MD5 hash are 4f0.", THREAD),
    official("First digit of solution only MD5 hash is 7.", THREAD),
    official("First two digits of TOMI field only MD5 hash are 89.", THREAD),
    official("Third word of TOMI field is alphabet.", THREAD),
    official("Second digit of solution only MD5 hash is not 3.", THREAD),
  ],
  solvedAt: "2019-06-15 00:05:14",
  solveTime: 125_772,
  transactions: [
    funding(
      "e58e2ef6ddff44268d82c089b991ea0a0ec0fefaf17adf5fa09e4e1714f658db",
      "2019-06-13 13:09:02",
      0.007,
    ),
    claim(
      "c34825e67c83a1454443028bfc86695a17d7b7fa29b6f7620da33fcdb2a62722",
      "2019-06-15 00:05:14",
      0.0067719,
    ),
  ],
});
