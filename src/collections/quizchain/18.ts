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

/** Where the question and the funding txid of block 18 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bbij0e/meidum_7_mbtc_quizchain_block_18/";

/** The author's comment of April 10, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bbij0e/comment/ekjcc1k/";

/**
 * Quizchain block 18: the name behind Kerckhoffs's principle, a space and the last three characters
 * of the block 17 key, hashed with MD5 into BIP39 entropy. No source printed the hash or the key.
 */
export const quizchainBlock18 = bitcoinPuzzle({
  id: "quizchain/18",
  address: p2pkh("16Cn1vy7wEGzy3TWgwCzrcLd91n856Myn5", "3912c8310f999eaa93c474ee6d8045c1551aecae"),
  sourceUrl: THREAD,
  startedAt: "2019-04-10 05:56:12",
  status: Status.Solved,
  pubkey: compressed("0226e59a96172e92b7d4a2010b32dd6589b13392dddeb8eb368487cac852db1afd"),
  key: wif("L2nS1Af6BM2C8PUe442nLWf7fBNK4q25k1thY4G9onLdgJVPqmEf")
    .entropy(
      "8c4705387f72118d9518c6f0ba7bfaa1",
      source(THREAD, "MD5 of the name, a space and the last three characters of the block 17 key"),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official(
      'Question: Start with "offs". Add the missing letters to get the solution string. Format: [solution] [link]. with exactly one space between them. Use MD5 as hash algorithm (changed from SHA 256 for all blocks after 15).',
      THREAD,
      undefined,
      {
        answer: answer("Kerckhoffs", THREAD),
      },
    ),
    official(
      "There are no letters in between, but these four may be at any position in the solution string. As I mentioned in my Twitter feed @NakamotoAoi, another letter is e, the only other vowel.",
      AUTHOR_COMMENT,
    ),
  ],
  solvedAt: "2019-04-10 10:55:13",
  solveTime: 17_941,
  transactions: [
    funding(
      "f299d6796ce34829eeff0a48a45717ad9c7f432c6e2aae21e84a9cb1f8eecabf",
      "2019-04-10 05:56:12",
      0.007,
    ),
    claim(
      "8df3586b2b217ddd56a6d6eddaaf5de45f712d7ca025d18c399fc68c82b582b8",
      "2019-04-10 10:55:13",
      0.00679777,
    ),
  ],
});
