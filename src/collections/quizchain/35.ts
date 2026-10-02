import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 35 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bcouou/easy_7_mbtc_quizchain_block_35/";

/**
 * Quizchain block 35: the Yang campaign's MATH hat in three words and the last three characters of
 * the block 34 key, hashed with MD5 into BIP39 entropy, with no BFUB field. No source printed the
 * hash or the key.
 */
export const quizchainBlock35 = puzzle({
  id: "quizchain/35",
  chain: "bitcoin",
  address: "1QG3XE2FRm6bp6hBrCnjchaaYVfDydCMH1",
  sourceUrl: THREAD,
  startedAt: "2019-04-13 09:37:50",
  status: Status.Solved,
  pubkey: compressed("031a1793b638dfc0b85c5d45533319a1389304484d8ca9674148bcdc55774b13a4"),
  key: wif("L31yQxfBdiKJXEMuQgkHCPvFQf5icVGfC5xve3BdrNYot1mGqebC")
    .entropy(
      "4710baf2e951169fc3ab381ab86f2fe5",
      source(
        THREAD,
        "MD5 of the three words and the last three characters of the block 34 key, separated by spaces",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question:   Think", THREAD, undefined, {
      answer: answer("Solution:  MATH Yang hat    BFUB no BFUB for this block.", THREAD),
    }),
    official(
      "Format:  [solution] [link] with exactly one space between them. Solution is a string of three words, second one of them Yang.",
      THREAD,
    ),
    official("Link from last block (still unsolved now) is 2PG.", THREAD),
  ],
  solvedAt: "2019-04-13 14:45:06",
  solveTime: 18_436,
  transactions: [
    funding(
      "11020a80bf92c3f17e4f479efe4ea984a15a69f8e5c6435d3506e89700d5c4fd",
      "2019-04-13 09:37:50",
      0.007,
    ),
    claim(
      "19e945bd89ca3a0527abee210993711ff966667460091b48de0176c7191f972a",
      "2019-04-13 14:45:06",
      0.00676948,
    ),
  ],
});
