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

/** Where the question and the funding txid of block 43 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bddijl/7_mbtc_quizchain_block_43/";

/** The author's Wattpad chapter Complete Quizchain, with the question and solution of every first run block. */
const SOLUTIONS = "https://www.wattpad.com/720895205-second-complete-quizchain";

/**
 * Quizchain block 43: the year of the scam the author read about in the Book of Swindles, BFUB, the
 * book's title and the last three characters of the block 42 key, hashed with MD5 into BIP39
 * entropy. The Reddit post was removed. The question survives in the author's Wattpad copy of the
 * whole first run. Someone brute forced the link and claimed it three days before block 42 fell. No
 * source printed the hash or the key.
 */
export const quizchainBlock43 = puzzle({
  id: "quizchain/43",
  chain: "bitcoin",
  address: "1MVWYyiyJVmNJRiEkyzcxp1gc5zmmftqrK",
  sourceUrl: THREAD,
  startedAt: "2019-04-15 07:01:42",
  status: Status.Solved,
  pubkey: compressed("030b1a0b217a760fb1af63e43ed50174fa7804df180213e96b5372481de5c3289e"),
  key: wif("KwoHhHcGp7YYqEWQUs3XUdyNyqtLfh4aAhCgU2UwQsqgx12GidA8")
    .entropy(
      "26ea250a918e2abb8ff02a149e1392a3",
      source(
        THREAD,
        "MD5 of the year, BFUB, the book and the last three characters of the block 42 key, separated by spaces",
      ),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Year of first Internet scam", SOLUTIONS, undefined, {
      answer: answer("1604 BFUB Book of Swindles", SOLUTIONS),
    }),
    official("Format: [solution] BFUB [BFUB] [link]", SOLUTIONS),
    official(
      "Resistance to immediate solving for this comes only from finding BFUB, so no hints for BFUB in this block. Should still be relatively easy.",
      SOLUTIONS,
    ),
  ],
  solvedAt: "2019-04-15 11:37:13",
  solveTime: 16_531,
  transactions: [
    funding(
      "6b193b7857188262ee578c84944ad124c9dc8ee2a155f7cdf0306821bc399487",
      "2019-04-15 07:01:42",
      0.007,
    ),
    claim(
      "3f0f2264e7a85e988cdf2e8b014b584095bae1b442bc1ec64441f7d743686b41",
      "2019-04-15 11:37:13",
      0.00690323,
    ),
  ],
});
