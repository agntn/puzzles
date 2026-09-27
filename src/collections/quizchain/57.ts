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

/** Where the question and the funding txid of block 57 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bfkdut/extremely_hard_7mbtc_quizchain_block_57/";

/**
 * Quizchain block 57: the letters AI, TOMI, `in both names` and a link of seven characters, hashed
 * with MD5 into BIP39 entropy. Block 56 was stuck behind a bad hash, so the post gave the link. No
 * source printed the hash or the key.
 */
export const quizchainBlock57 = bitcoinPuzzle({
  id: "quizchain/57",
  address: p2pkh("19Zrd7KSgGxcLuuQtSq3KLQbHSma6QH2F7", "5df7bd68d78feceb09e52ff94eb112887e13567f"),
  sourceUrl: THREAD,
  startedAt: "2019-04-21 02:48:31",
  status: Status.Solved,
  pubkey: compressed("03d96a433ffc78fb4f9bc0267046c5d13a0979237d72c48d9605439d78d82251ff"),
  key: wif("KzdsnGKmDEWDqLeG7SwYrS4cuJryU2fR2HRGjen4vozFMPojFPus")
    .entropy(
      "100d2c8de86057a051aef72bf5150452",
      source(THREAD, "MD5 of the two letters, TOMI, three words and the link the post set"),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official(
      "Question: I am looking for conclusive proof that someone named Craig (I am not telling you which one, don't want to be sued by the dude) is Satoshi.",
      THREAD,
      undefined,
      {
        answer: answer('Solution was "AI" and TOMI was "in both names".', THREAD),
      },
    ),
    official(
      "[solution] format is two capital letters. TOMI format is [word1 word2 word3], all words in lower case and no period at the end.",
      THREAD,
    ),
    official("Link from block 56 is BJRNw7D.", THREAD),
  ],
  solvedAt: "2019-04-21 11:34:34",
  solveTime: 31_563,
  transactions: [
    funding(
      "e5281359285fe1d272fbd7c0b152ee086373e8860a5a94dd47e0fafd577e1652",
      "2019-04-21 02:48:31",
      0.007,
    ),
    claim(
      "76fe64af6d7820ba20e9547213d95d132c1b435f75082fdf630197a73373b9d0",
      "2019-04-21 11:34:34",
      0.00688096,
    ),
  ],
});
