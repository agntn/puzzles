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

/** Where the question and the funding txid of block 67 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bhlq2i/3_of_3_67_mbtc_quizchain_block_67/";

/** The author's Wattpad chapter Complete Quizchain, with the question and solution of every first run block. */
const SOLUTIONS = "https://www.wattpad.com/720895205-second-complete-quizchain";

/** The author's comment of April 27, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bhlq2i/comment/elvz263/";

/** The author's comment of April 27, 2019 in the thread. */
const AUTHOR_COMMENT_2 = "https://www.reddit.com/r/bitcoinpuzzles/comments/bhlq2i/comment/elvthea/";

/**
 * Quizchain block 67: three words for Why and Nakamoto, TOMI, a fixed text and the whole block 66
 * key, hashed with MD5 into BIP39 entropy, for 67 mBTC. The Wattpad solutions quote the winner's
 * explanation. A player printed the WIF in the block 68 thread.
 */
export const quizchainBlock67 = puzzle({
  id: "quizchain/67",
  chain: "bitcoin",
  address: "1KPY8mFdyCyBVxmzpCgkgLJvtosJnDUQ2G",
  sourceUrl: THREAD,
  startedAt: "2019-04-26 12:21:11",
  status: Status.Solved,
  pubkey: compressed("03963a4a783e0fba5b6561c4d45fd54833f9ee4f5b56ac46af84db6d875695d9a4"),
  key: wif("L5KYypSnFznkzqotEVAWTaMvhDXjAqYYejKF8pDw8TgtGEx1mxfe").entropy(
    "37a8385ca320b50afc0b35a731a973dc",
    source(THREAD, "MD5 of the three words, TOMI, the fixed text and the whole block 66 key"),
  ),
  techniques: [technique("md5-to-bip39-entropy", THREAD), technique("atbash", SOLUTIONS)],
  prize: 0.067,
  hints: [
    official("Question: Why Nakamoto?", THREAD, undefined, {
      answer: answer('The solution was "Atbash Middle Origin".', SOLUTIONS),
    }),
    official("Format: [solution] TOMI Try your best shot first [link]", THREAD),
    official("[solution] is three words, all upper case, in alphabetical order.", THREAD),
    official(
      "In contrast, with Upper Case as in this question I want only the first letter as capital letter, so it would be Example, not EXAMPLE.",
      AUTHOR_COMMENT,
    ),
    official(
      "It is now and the private key (which goes into link for this block) is L3Ame7sfViKWacDRNr3SeNcTaFFKfRtWGUD74NWMLSR6AobdHGYZ.",
      AUTHOR_COMMENT_2,
    ),
  ],
  solvedAt: "2019-04-27 03:22:19",
  solveTime: 54_068,
  transactions: [
    funding(
      "b44b67cb5fc4d61a9ba3c9be10313f48e1dafcbee24b2353564637829a908180",
      "2019-04-26 12:21:11",
      0.067,
    ),
    claim(
      "8eb19633fdc7f7bfbd634954a8dbd40af53d27925dcd50c45d94a8d96383edbe",
      "2019-04-27 03:22:19",
      0.06673951,
    ),
  ],
});
