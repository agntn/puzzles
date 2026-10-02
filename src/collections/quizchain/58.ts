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

/** Where the question and the funding txid of block 58 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bfz0oy/7_mbtc_quizchain_block_58/";

/**
 * Quizchain block 58: `all` through Atbash, TOMI, `Atbash` and the last seven characters of the
 * block 57 key, which the post gave, hashed with MD5 into BIP39 entropy. The block 59 post printed
 * the WIF.
 */
export const quizchainBlock58 = puzzle({
  id: "quizchain/58",
  chain: "bitcoin",
  address: "1J6ymES7FTdNGpPbMEyTVYSA53Pz8poqRy",
  sourceUrl: THREAD,
  startedAt: "2019-04-22 07:03:25",
  status: Status.Solved,
  pubkey: compressed("03a33f720033bf71b94a65949935e2f3538e9b0ee193e79f70eaaca4ec40b63e29"),
  key: wif("KxgvXT1LidEhei6XizyCpR5zgPbALFYYxT6R1tANmSgPKZeuhs51").entropy(
    "1ebac638d0c815fc68f605377cd87eac",
    source(THREAD, "MD5 of the word, TOMI, the cipher and the link the post set"),
  ),
  techniques: [technique("md5-to-bip39-entropy", THREAD), technique("atbash", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: You all know this three letter word.", THREAD, undefined, {
      answer: answer(
        'The three letter word in the question was "all", using the Atbash on that gives "zoo".',
        THREAD,
      ),
    }),
    official(
      "[TOMI] is the name of the method used to get it, one word in upper case (only first letter capital).",
      THREAD,
      undefined,
      {
        answer: answer('And since TOMI is the method, the word "Atbash" goes there.', THREAD),
      },
    ),
    official("Link is set to PojFPus for this block.", THREAD),
  ],
  solvedAt: "2019-04-22 07:36:37",
  solveTime: 1992,
  transactions: [
    funding(
      "211bdc4d57fc154d6623ba6d0a63cfd65bdc9aedcafd9d84c5e465879aac7d5e",
      "2019-04-22 07:03:25",
      0.007,
    ),
    claim(
      "f319cce9eb0914c32873b3cf7decf57bc1f21e23a191e77e5c73f14b09fe4127",
      "2019-04-22 07:36:37",
      0.00682931,
    ),
  ],
});
