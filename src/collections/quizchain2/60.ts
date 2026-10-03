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

/** The block 60 thread, with the question, the funding txid, the hash digits, two hints and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c9tbo0/7_mbtc_quizchain2_block_60/";

/** u/Quantris's comment with the solution. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/c9tbo0/comment/etbfmtr/";

/** Quizchain2 block 60: `Mayer Multiple`, the price indicator behind `Price 2N` once Atbash turns it into MM. */
export const quizchain2Block60 = puzzle({
  id: "quizchain2/60",
  chain: "bitcoin",
  address: "1Gz9gHf4VyPorCDkpXtPg1xakQwGsJ7TP3",
  sourceUrl: THREAD,
  startedAt: "2019-07-06 02:14:11",
  status: Status.Solved,
  pubkey: compressed("03d1f28ea540fdf4aa0069d37bdc97d61922c71efaa5bd031fdc3fe4e3b1e6a1bd"),
  key: wif("L256zRAFxCi98t3NE17vHvAs8rUgWV73fm58a5Bi4bUyJ2NfEZqF")
    .entropy("e8328012af0071c31ceb0c6113c8b25c", source(THREAD, "MD5 of the two words"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD), technique("atbash", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Price 2N", THREAD, undefined, {
      answer: answer('Solution was "Mayer Multiple".', THREAD),
    }),
    official("Format: [solution]", THREAD, undefined, {
      answer: answer('Got a confirmation; the solution was "Mayer Multiple".', PLAYER_COMMENT),
    }),
    official("First three digits of MD5 hash are e83.", THREAD),
    official("I use it quite a bit here.", THREAD),
    official("Atbash makes this", THREAD),
    official("price MM", THREAD),
  ],
  solvedAt: "2019-07-09 04:08:18",
  solveTime: 266_047,
  transactions: [
    funding(
      "c21bd6238a66318a27b5bf54d7e3bdbd16f41c707336c8189f983199f0069bb9",
      "2019-07-06 02:14:11",
      0.007,
    ),
    claim(
      "786909499a0f53356062ae87fb83e64ce3006d24e90edc653dac85d054b27282",
      "2019-07-09 04:08:18",
      0.00698,
    ),
  ],
});
