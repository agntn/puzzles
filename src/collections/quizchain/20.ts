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

/** Where the question and the funding txid of block 20 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bbl653/medium_7_mbtc_quizchain_block_20/";

/**
 * Quizchain block 20: the Japanese name of Pokémon number 132, a space and the last three
 * characters of the block 19 key, hashed with MD5 into BIP39 entropy. No source printed the hash or
 * the key.
 */
export const quizchainBlock20 = bitcoinPuzzle({
  id: "quizchain/20",
  address: p2pkh("1B6HjduAWAyaUUDxaLrNP6YXzynmA3HAdW", "6eb14eb2728c037e8a7a66086c47d4e7c2916b68"),
  sourceUrl: THREAD,
  startedAt: "2019-04-10 11:53:13",
  status: Status.Solved,
  pubkey: compressed("03ca7882a333a161545e4786bdceeab57709fea2fd474697f1d502bb9ac63a27fe"),
  key: wif("L3qgQ3FVMZeqhDvg1LrhYt1TQbQzjJRhk5ZEoGv1wPaXwytDUzcQ")
    .entropy(
      "0af1d6e26d67473366ac39ae94e72b93",
      source(THREAD, "MD5 of the name, a space and the last three characters of the block 19 key"),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: 132", THREAD, undefined, {
      answer: answer("Solution was Metamon, which is the Japanese name of Ditto", THREAD),
    }),
    official(
      "Format: [solution] [link] with exactly one space between them and no period anywhere. First letter of solution is capitalized.",
      THREAD,
    ),
    official(
      "One hint now only: This is NOT kanji number 132 in some list or other. No kanji involved in this block.",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-11 04:27:14",
  solveTime: 59_641,
  transactions: [
    funding(
      "62644b298643648502f237472abb64f7eb6b204949d890e8c2ed430230b3c034",
      "2019-04-10 11:53:13",
      0.007,
    ),
    claim(
      "08e74cdd7f96578c21289da0e2041e8ea6d38036a36340f746b0b9eeaab96acb",
      "2019-04-11 04:27:14",
      0.00669771,
    ),
  ],
});
