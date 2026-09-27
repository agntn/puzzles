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

/** Where the question and the funding txid of block 38 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bd0hhv/easy_7_mbtc_quizchain_block_38/";

/** The author's Wattpad chapter Complete Quizchain, with the question and solution of every first run block. */
const SOLUTIONS = "https://www.wattpad.com/720895205-second-complete-quizchain";

/**
 * Quizchain block 38: the first Bond villain, BFUB, the second letter of each part of his name and
 * the last three characters of the block 37 key, hashed with MD5 into BIP39 entropy. Claimed eleven
 * and a half minutes after funding. No source printed the hash or the key.
 */
export const quizchainBlock38 = bitcoinPuzzle({
  id: "quizchain/38",
  address: p2pkh("17ZWMrmzqah2HNVk7MqgdavJTj3WJ7fLiv", "47f692db616f9b7fe6a41b349e27f9bdff611aff"),
  sourceUrl: THREAD,
  startedAt: "2019-04-14 07:37:59",
  status: Status.Solved,
  pubkey: compressed("029423d7d6b13b1c23aa845c5b9391c5c207093cee373937c7d87b2ba7c4aa3833"),
  key: wif("L4Lx6oHzwhX2JsN83FVtQu8PzPMPz9WmzqHsaea9xHABUwax3B3j")
    .entropy(
      "ea8c10263db9ed4e3be0ac1aa0803dfb",
      source(
        THREAD,
        "MD5 of the villain, BFUB, the second letters of both words and the last three characters of the block 37 key, separated by spaces",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: Villain in the first James Bond novel", THREAD, undefined, {
      answer: answer("Le Chiffre BFUB eh.", SOLUTIONS),
    }),
    official(
      "BFUB for this are two letters, the second letter of each of the parts of the name.",
      THREAD,
    ),
    official("Link to previous block: nhd First two digits of MD5 hash: ea", THREAD),
  ],
  solvedAt: "2019-04-14 07:49:32",
  solveTime: 693,
  transactions: [
    funding(
      "797de4ee8d97c0e06f6eb1ff9239ffadfccfcc3f05ae26fe55b827ed68def2e1",
      "2019-04-14 07:37:59",
      0.007,
    ),
    claim(
      "d4e367a20f0886319b52be8b42d006e23445ecde8290e8183dc17ed13952805b",
      "2019-04-14 07:49:32",
      0.00690554,
    ),
  ],
});
