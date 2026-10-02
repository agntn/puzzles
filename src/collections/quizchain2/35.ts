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

/** The block 35 thread, with the question, the funding txid, both hints and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/bzc5ed/7_mbtc_quizchain2_block_35/";

/** u/puzzleponky's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/bzc5ed/comment/eqrhaem/";

/** Quizchain2 block 35: `May 2020`, the month of the Bitcoin halving, with its block in the TOMI field. */
export const quizchain2Block35 = puzzle({
  id: "quizchain2/35",
  chain: "bitcoin",
  address: "18xoCmXbQ5wgdCvqzmovFv82JjjtPJ66tz",
  sourceUrl: THREAD,
  startedAt: "2019-06-11 07:11:10",
  status: Status.Solved,
  pubkey: compressed("037d56b403a109dec7480e01f3d98a5b61c19ac2d19afc2beebe016e73bbaf2410"),
  key: wif("L2npvCw6FgofpHc6H5ZybPdTfWQNYkR5rRuNunrrLji9jR8PuXXo")
    .entropy(
      "56c65bfa1daa8d8b6c381e8a3a7df642",
      source(THREAD, "MD5 of the month and year, TOMI, a word and a number"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: In what month will the first Grycoin be mined?", THREAD, undefined, {
      answer: answer("Solution was May 2020 and TOMI field was Halvening 630000.", THREAD),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer('Answer is "May 2020 TOMI Halvening 630000"', PLAYER_COMMENT),
    }),
    official('The format for the solution is [month] [year], like "June 2019".', THREAD),
    official(
      'TOMI is one word and one number. The first letter of the word is capital, like "Solution".',
      THREAD,
    ),
    official("First three digits of MD5 hash are 56c.", THREAD),
    official("First digit of solution only MD5 hash is 0.", THREAD),
    official("First two digits of TOMI field only MD5 hash are 3c.", THREAD),
    official(
      "Hint 1: The number has six digits and is a multiple of 21. No leading zero for this number.",
      THREAD,
    ),
    official("MIning will be outsourced to Bitcoin.", THREAD),
  ],
  solvedAt: "2019-06-11 13:42:36",
  solveTime: 23_486,
  transactions: [
    funding(
      "e767fa093304f2c416fe6d725305deab4c2605a7550743758369bf3acea7acb9",
      "2019-06-11 07:11:10",
      0.007,
    ),
    claim(
      "f432886b9c35f9a375c7f2c1ba9a0e3d95cc210cfd8b295631c9d666bbe0c168",
      "2019-06-11 13:42:36",
      0.0068489,
    ),
  ],
});
