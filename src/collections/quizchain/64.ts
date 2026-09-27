import {
  answer,
  claim,
  compressed,
  funding,
  official,
  p2pkh,
  source,
  wif,
} from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 64 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bh52id/7_mbtc_quizchain_block_64/";

/** The author's Wattpad chapter Complete Quizchain, with the question and solution of every first run block. */
const SOLUTIONS = "https://www.wattpad.com/720895205-second-complete-quizchain";

/** The author's comment of April 26, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bh52id/comment/elthvrq/";

/**
 * Quizchain block 64: `Y`, the Atbash partner of the second letter, then TOMI, `Atbash 2` and the
 * whole block 63 key, hashed with MD5 into BIP39 entropy. It held 28 hours. The author printed the
 * WIF as the link for block 65.
 */
export const quizchainBlock64 = bitcoinPuzzle({
  id: "quizchain/64",
  address: p2pkh("15odDESGAo53neU94hqYfxwTWTBLYmykz2", "34b1dd5d68782984c0a0a69c0391ed0816a09678"),
  sourceUrl: THREAD,
  startedAt: "2019-04-25 05:39:37",
  status: Status.Solved,
  pubkey: compressed("03cf09c2de8371c27a9faec51634842212c9f0cf136d6a7612903de83c09cd6d22"),
  key: wif("L565NraUtwZkJfjMwv8Zi58fSfMe6J8jhUYbVvKY6FPKLjod36og").entropy(
    "a1a274aed106c77c4105af798da54926",
    source(THREAD, "MD5 of the letter, TOMI, the cipher, the number and the whole block 63 key"),
  ),
  prize: 0.007,
  hints: [
    official("Question: Looking for one capital letter out of two.", THREAD, undefined, {
      answer: answer("Y TOMI Atbash 2", SOLUTIONS),
    }),
    official("Link is all digits of private key for block 63 (Darling).", THREAD),
    official(
      "As a general rule, looking at the methods used in recent blocks often leads to success...",
      AUTHOR_COMMENT,
    ),
  ],
  solvedAt: "2019-04-26 09:39:46",
  solveTime: 100_809,
  transactions: [
    funding(
      "1052a5cd45f54cdb6d3533650fbcaae1f259ee02101406fa3c617de440c784ac",
      "2019-04-25 05:39:37",
      0.007,
    ),
    claim(
      "0deb15a5856b8f6a66a515831f3f2dc91cc0237e403a0fc2f511aa3ae786f402",
      "2019-04-26 09:39:46",
      0.00669587,
    ),
  ],
});
