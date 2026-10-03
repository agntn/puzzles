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

/** The block 48 thread, with the question, the funding txid and the hash digits. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c4ndaa/7_mbtc_quizchain2_block_48/";

/** u/puzzleponky's comment with the whole winning string, the only place the solution was published. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/c4ndaa/comment/erxhy2q/";

/** Quizchain2 block 48: `Think different`, an advertising slogan, with `Apple slogan` in the TOMI field. */
export const quizchain2Block48 = puzzle({
  id: "quizchain2/48",
  chain: "bitcoin",
  address: "19NR1m283F8npNdauDjQgbnEiR5cA2mdcp",
  sourceUrl: THREAD,
  startedAt: "2019-06-24 06:05:23",
  status: Status.Solved,
  pubkey: compressed("02c31a294202345afd89eef5b756f4c8c9e4ed5dd4dc6a88c1c389ed0aa66b910e"),
  key: wif("L3kWnd9712hqj9QZVRA9oLAXZ3x2ddK3nRMEPN3Q5iV8D3PuZoP4")
    .entropy(
      "2c142b58c037bc30c44da6277c2cff91",
      source(PLAYER_COMMENT, "MD5 of the two words, TOMI and two words"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", PLAYER_COMMENT)],
  prize: 0.007,
  hints: [
    official("Question: Think", THREAD, undefined, {
      answer: answer(
        'This was not that hard given the word "Think" and the topic "advertising campaign" as there is a particular fruity company that has used this.',
        PLAYER_COMMENT,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("Think different TOMI Apple slogan", PLAYER_COMMENT),
    }),
    official(
      "Solution format is two words, the first one with first letter in capitals, like Word1 word2.",
      THREAD,
    ),
    official("TOMI field format is also Word1 word2.", THREAD),
    official("First three digits of MD5 hash are 2c1.", THREAD),
    official("First digit of solution only MD5 hash is e.", THREAD),
    official("First two digits of TOMI field only MD5 hash are f3.", THREAD),
    official("This block will be similar in purpose.", THREAD),
  ],
  solvedAt: "2019-06-24 14:00:37",
  solveTime: 28_514,
  transactions: [
    funding(
      "0601c2d6b06a9dee4491eeb2123a72bfc132dab3e1bda04fdb79e6fd914b6ccb",
      "2019-06-24 06:05:23",
      0.007,
    ),
    claim(
      "930486a0af9addbe3ba73cf337aa3d1c77ffdfada166d0125643c8db231facc6",
      "2019-06-24 14:00:37",
      0.00673658,
    ),
  ],
});
