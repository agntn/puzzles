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

/** The block 61 thread, with the question, the funding txid, the hash digits, three hints and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/ca58xg/77_mbtc_quizchain2_block_61/";

/** AoiNakamoto's reply that the solution is a bare number and the dot belongs to the TOMI field. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/Grycoin/comments/ca58xg/comment/etf3gfj/";

/** u/JDScreesh's comment with the solution and the whole MD5 hash. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/ca58xg/comment/etghruh/";

/** Quizchain2 block 61: `350`, the safe CO2 level, with `.org` as the TOMI field and a lone dot as a hint. */
export const quizchain2Block61 = puzzle({
  id: "quizchain2/61",
  chain: "bitcoin",
  address: "1CKDiWxbYF8v5KShLTJkuMqDkxeNaqj4yU",
  sourceUrl: THREAD,
  startedAt: "2019-07-07 02:49:59",
  status: Status.Solved,
  pubkey: compressed("02c6c0b2c8bc4fa7faab53a50c0c24756798a2503d955f608ae2ec6c7e55f72e6a"),
  key: wif("KyfhrSRoruWDzWinJdZCaQv1va2XCiraxJfYzDwtJ3R7tzFyJrRn")
    .entropy("06da9c6f65b60920eefcdf2443a6e24e", source(THREAD, "MD5 of the number, TOMI and .org"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.077,
  hints: [
    official("Question: A number.", THREAD, undefined, {
      answer: answer("As winner reports in comments, solution was 350 and TOMI was .org.", THREAD),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("350 TOMI .org", PLAYER_COMMENT),
    }),
    official("First three digits of MD5 hash are 06d (not copypasted but triple checked).", THREAD),
    official(
      "First two digits of TOMI field only are 4b (not copypasted but double checked).",
      THREAD,
    ),
    official(
      "Hint: Not just any number, but the most important number in the history of humanity.",
      THREAD,
    ),
    official(
      "Hint 2: Smallest hint ever. If you look really hard, maybe you can see it below:",
      THREAD,
    ),
    official(".", THREAD),
    official(
      'So here goes a more decisive hint on what this is about. "Most important number" does not mean much if you do not know what is important in my world. A clue to that is found in the last big block before this one (block 57), where I say that a certain problem seems to be important. Important enough to make it the topic of the 7 pm big block on Tanabata day.',
      THREAD,
    ),
    official(
      "Yes, only number, no other element. And actually no decimal point, I just said in the hint that the dot is in the TOMI field.",
      AUTHOR_COMMENT,
    ),
  ],
  solvedAt: "2019-07-10 20:28:04",
  solveTime: 322685,
  transactions: [
    funding(
      "4cd366e045832f56ac5cfa354edd3b7505ff4caee32e4c0b48f192faed652d26",
      "2019-07-07 02:49:59",
      0.077,
    ),
    claim(
      "afe8352f96f16dda3abab49bfdb93fd09b475af0bf0b1361b7c4a365dc7e8eaa",
      "2019-07-10 20:28:04",
      0.07651357,
    ),
  ],
});
