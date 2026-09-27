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

/** Where the question and the funding txid of block 41 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bd31hw/7_mbtc_quizchain_block_41/";

/**
 * Quizchain block 41: `P`, BFUB, three words and the last three characters of the block 40 key,
 * hashed with MD5 into BIP39 entropy. The author's update misquotes the field as "next to no", then
 * prints the hash and the WIF from the journal and corrects it to "next after no".
 */
export const quizchainBlock41 = bitcoinPuzzle({
  id: "quizchain/41",
  address: p2pkh("1MbB3CtYdhoix9j1SovN6jxzrpA9KKU8Qr", "e1d909a61c12068354a93aba8a64a1883ab4958a"),
  sourceUrl: THREAD,
  startedAt: "2019-04-14 13:50:10",
  status: Status.Solved,
  pubkey: compressed("03929448ca03bd7bd88d2221e6ea89ab78b1791c27996e5bad06d0fd8356c64dd4"),
  key: wif("KyQtSJhombsmQAaXsUFqFr6zg3uD6SHGP6oHZYzmnXELa7hWgemF").entropy(
    "8dade6a1b051874eae09fcb5c431b5ed",
    source(
      THREAD,
      "MD5 of the letter, BFUB, the hint of three words and the last three characters of the block 40 key, which the author printed with the WIF",
    ),
  ),
  prize: 0.007,
  hints: [
    official(
      "Question: Can you find the solution with absolutely no hint whatsoever?",
      THREAD,
      undefined,
      {
        answer: answer(
          'Solution for this was P,  the method behind it was taking the obvious first step "no" and then noticing that the letters in "no" are following each other in the alphabet, which makes P the next one.',
          THREAD,
        ),
      },
    ),
    official(
      "Looking for one single capital letter in the solution. BFUB format is [word1] [word2] [word3].",
      THREAD,
      undefined,
      {
        answer: answer('BFUB was not "next to no" but "next after no".', THREAD),
      },
    ),
    official(
      "Link from last block: Not provided this time, you need to solve last block to challenge this one.",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-14 18:07:33",
  solveTime: 15_443,
  transactions: [
    funding(
      "2fcaeeaf487609373b3d8231e5f11d90a6ad013df823143f0b7081d63abbd2b9",
      "2019-04-14 13:50:10",
      0.007,
    ),
    claim(
      "08f0d5223a2338c96fe2edb76697eaa1bd96465d8d3c69bbca45ea839dc37bd5",
      "2019-04-14 18:07:33",
      0.00687148,
    ),
  ],
});
