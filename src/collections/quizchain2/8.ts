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

/** Where the question, the funding txid, the link and the solution of block 8 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bpjipk/7_mbtc_quizchain2_block_8/";

/** The author's reply of May 17, 2019 about well known passphrases. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bpjipk/comment/enugazk/";

/** u/mooncritic's comment with the whole phrase. */
const PLAYER_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bpjipk/comment/enuhtjg/";

/**
 * Quizchain2 block 8: xkcd's `correct horse battery staple` twice and the whole block 6 key,
 * hashed with MD5 into BIP39 entropy. No source printed the hash or the key.
 */
export const quizchain2Block8 = bitcoinPuzzle({
  id: "quizchain2/8",
  address: p2pkh("18AoFSmoTH34cbRy9QW4X4ZxCTdS1iwswD", "4ea33b1c17388c6769b9c3e958dab37a7ae5531e"),
  sourceUrl: THREAD,
  startedAt: "2019-05-16 11:57:33",
  status: Status.Solved,
  pubkey: compressed("02b302546efc47a42ccfe849e7797dfefb6639755424e74db4328cce95fc717906"),
  key: wif("L45dLEP5xr2aZLaGuMagF8bcr9PNurGgigqAQa2vFkLSZSgAyXUh")
    .entropy(
      "b322677e2c01cc97c918f241b824174d",
      source(THREAD, "MD5 of the eight words and the whole block 6 key"),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: Eight words.", THREAD, undefined, {
      answer: answer(
        'I used the famous passphrase "correct horse battery staple" for this one as a challenge to the players that rely on scripts to get their solution.',
        THREAD,
      ),
    }),
    official(
      "Format: [word1 word2 word3 word4 word5 word6 word7 word8] [link]",
      THREAD,
      undefined,
      {
        answer: answer("correct horse battery staple correct horse battery staple", PLAYER_COMMENT),
      },
    ),
    official(
      "All words in all letters lower case and one space between words, no period at the end.",
      THREAD,
    ),
    official("Use L2gi9LjJwv6oRBdBAJMo3QTNmfdqLRYxbW7o1MhC5K7NNh2JqPSZ as a link.", THREAD),
    official("First three digits of MD5 hash are b32.", THREAD),
    official("I know that. Which is in turn a hint for the solution...", AUTHOR_COMMENT),
  ],
  solvedAt: "2019-05-17 01:47:58",
  solveTime: 49_825,
  transactions: [
    funding(
      "3a9f2bd0ff07c8bfc4201cc6498eec0cd9bd476c88a07ae59d710d895219ea50",
      "2019-05-16 11:57:33",
      0.007,
    ),
    claim(
      "5d20412ed6c1bd03dfde7995741b484cfaaf8dd044b0e2b709c2d250bc94c37e",
      "2019-05-17 01:47:58",
      0.00648415,
    ),
  ],
});
