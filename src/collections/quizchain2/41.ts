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

/** The block 41 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c1kuxd/7_mbtc_quizchain2_block_41/";

/** u/silver_anth's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/c1kuxd/comment/erdvubd/";

/** Quizchain2 block 41: `truth rarity`, the two words before the key in The Legend of Satoshi Nakamoto, with that puzzle's address in the TOMI field. */
export const quizchain2Block41 = puzzle({
  id: "quizchain2/41",
  chain: "bitcoin",
  address: "16ViXuAGqBRacWLh33KPty2B4ofYRGa6b6",
  sourceUrl: THREAD,
  startedAt: "2019-06-17 07:40:58",
  status: Status.Solved,
  pubkey: compressed("0375aa8acbb1b1ea7680afc2791a0096f91e900870a7aba624415e5d186b5cd153"),
  key: wif("L4kB6omodTb59i3L5ki462EgrbsRRDK6trg1A6VVP9hHLmG1egzD")
    .entropy(
      "8e81dee03e6b815485a3644cc90893fd",
      source(THREAD, "MD5 of the two words, TOMI and the address"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Beauty", THREAD, undefined, {
      answer: answer(
        "Solution was truth rarity and TOMI field was the Bitcoin address 1FLAMEN6rq2BqMnkUmsJBqCGWdwgVKcegd.",
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("truth rarity TOMI 1FLAMEN6rq2BqMnkUmsJBqCGWdwgVKcegd", PLAYER_COMMENT),
    }),
    official('Solution format is two words both in lower case like "word1 word2"', THREAD),
    official("TOMI field format is one item.", THREAD),
    official("First three digits of MD5 hash are 8e8.", THREAD),
    official("First digit of solution only MD5 hash is a.", THREAD),
    official("First two digits of TOMI field only MD5 hash are 07.", THREAD),
  ],
  solvedAt: "2019-06-17 08:33:06",
  solveTime: 3_128,
  transactions: [
    funding(
      "e2bd60fbe3e91e849fc0e9360aa92991218f17bd7ac3871522815476b505fe5e",
      "2019-06-17 07:40:58",
      0.007,
    ),
    claim(
      "818f3bfcfd3bf550db20bb619c2dcc68a7b4c4b0f0658316803716e1856c9a9d",
      "2019-06-17 08:33:06",
      0.00684832,
    ),
  ],
});
