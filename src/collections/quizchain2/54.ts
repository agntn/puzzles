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

/** The block 54 thread, with the question, the funding txid, the hash digits, five hints and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c78se0/7_mbtc_quizchain2_block_54/";

/** u/silver_anth's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/c78se0/comment/ese1sru/";

/** Quizchain2 block 54: `HAS`, Hal's S shifted like HAL to IBM, with `HAL BIT Caesar` in the TOMI field. */
export const quizchain2Block54 = puzzle({
  id: "quizchain2/54",
  chain: "bitcoin",
  address: "1HK86jWSJoWYwDaMSw5PL5oVfqjoiSbaQ1",
  sourceUrl: THREAD,
  startedAt: "2019-06-29 23:30:20",
  status: Status.Solved,
  pubkey: compressed("02037f873b81bbe8886d8ec9d3d3565de1df9631df6f7cf58406f37ae446b5853b"),
  key: wif("KzbLxqZdBuNJWkCouW1v47Vwbp9oBAN2WNb3nyM64mFhckqfg9tt")
    .entropy(
      "2d73ff7b955ab880925c0eddcef8af0b",
      source(THREAD, "MD5 of the three letters, TOMI and three words"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: What's the S stand for?", THREAD, undefined, {
      answer: answer(
        'As winner posted in comments, solution was "HAS" and TOMI field was HAL BIT Caesar.',
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI].", THREAD, undefined, {
      answer: answer("HAS TOMI HAL BIT Caesar", PLAYER_COMMENT),
    }),
    official("Format of solution is three capital letters, including S.", THREAD),
    official("First three digits of MD5 hash are 2d7.", THREAD),
    official("First two digits of TOMI field only are ee.", THREAD),
    official(
      "Hint 1: TOMI format [XXX XXX Word] with XXX three capital letters and word first letter only in capital.",
      THREAD,
    ),
    official(
      "Hint 2: Hal's posts on bitcointalk https://bitcointalk.org/index.php?action=profile;u=2436;sa=showPosts",
      THREAD,
    ),
    official("Hint 3: Number 4 on that list.", THREAD),
    official("Hint 4: IBM and BITcoin", THREAD),
    official("Hint 5: Imperfect anagram HAL", THREAD),
  ],
  solvedAt: "2019-06-30 06:48:05",
  solveTime: 26_265,
  transactions: [
    funding(
      "5fcff3e4e25d10da663514c559ef573314895c7827c800caa72e3ac25c81e48b",
      "2019-06-29 23:30:20",
      0.007,
    ),
    claim(
      "63cf498f2bfbe2c86c19a346f19ef8da7c8ceb587d9efffe8e2e02cbf80ec6c5",
      "2019-06-30 06:48:05",
      0.00661024,
    ),
  ],
});
