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

/** Where the question, the funding txid and the method of block 4 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bo356q/7_mbtc_quizchain2_block_4/";

/** u/puzzleponky's comment with the whole winning string and the block 3 key. */
const PLAYER_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bo356q/comment/enbxj6y/";

/**
 * Quizchain2 block 4: `MasK`, the word inside the block 3 key, then TOMI and four words, hashed
 * with MD5 into BIP39 entropy. No source printed the hash or the key.
 */
export const quizchain2Block4 = bitcoinPuzzle({
  id: "quizchain2/4",
  address: p2pkh("1C1e2wvP5p6JRyV4BtRHjprCuBcUXLudNQ", "78c84c353224ce0bfcbc9eab8f64201ab14935fd"),
  sourceUrl: THREAD,
  startedAt: "2019-05-13 12:33:25",
  status: Status.Solved,
  pubkey: compressed("0385f0b820b4a7de14503b97a86b61904f1ffde8beae67a7b131f8265dd37a0828"),
  key: wif("L3PyFkCsVdej9qktSKZvfYqzmxes6SWRvGeAqoS4jxirrSi69hfz")
    .entropy(
      "9acb509e171c3baaf8ad1fa982648bdc",
      source(THREAD, "MD5 of the word, TOMI and four words"),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official(
      "Question: Looking for a four letter word. Yes, quite safe for work.",
      THREAD,
      undefined,
      {
        answer: answer(
          "Once you see the word in the previous block private key, it becomes easy. That is the reason I did not include a link, since it would become too obvious.",
          THREAD,
        ),
      },
    ),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("MasK TOMI previous block private key", PLAYER_COMMENT),
    }),
    official("First three digits of MD5 hash: 9ac", THREAD),
    official("First digit of solution only MD5 hash: 2", THREAD),
    official("First digit of TOMI field only MD5 hash: 9", THREAD),
  ],
  solvedAt: "2019-05-13 13:57:44",
  solveTime: 5059,
  transactions: [
    funding(
      "7446567ec9b8247cc77a34441c24c0eec15922b2b5e524725ec0977f63bb82b9",
      "2019-05-13 12:33:25",
      0.007,
    ),
    claim(
      "12f20e5e032070cb3a6b9ad105cb4caca0c5123234cf328e0ec83fba6096a25e",
      "2019-05-13 13:57:44",
      0.00679648,
    ),
  ],
});
