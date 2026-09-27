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

/** Where the question and the funding txid of block 74 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bjnzi8/11_mbtc_quizchain_block_74/";

/** The author's comment of May 2, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bjnzi8/comment/emb8d3y/";

/** The author's comment of May 4, 2019 in the thread. */
const AUTHOR_COMMENT_2 = "https://www.reddit.com/r/bitcoinpuzzles/comments/bjnzi8/comment/emiutzl/";

/**
 * Quizchain block 74: the victim of Poirot's own murder in Curtain, TOMI, `Othello` and the whole
 * block 73 key, hashed with MD5 into BIP39 entropy, for 11 mBTC. The author printed the WIF as the
 * link for block 75.
 */
export const quizchainBlock74 = bitcoinPuzzle({
  id: "quizchain/74",
  address: p2pkh("1HbUcHKfpkUSssNtcfS3vKzdTMue3EByMQ", "b6073394d3fd08f7ddac22508895535944c072bf"),
  sourceUrl: THREAD,
  startedAt: "2019-05-01 23:42:07",
  status: Status.Solved,
  pubkey: compressed("0312b422a56647895f549b81db0f36a964479696ec86b374be8b353167257825dd"),
  key: wif("L1myU8V1SzKbAvW51KcEaA6EvfpmffqNuTgMdmY45XpH99VyYMAm").entropy(
    "0a7c902815f9dc9d26057280592b2553",
    source(THREAD, "MD5 of the victim, TOMI, the play and the whole block 73 key"),
  ),
  prize: 0.011,
  hints: [
    official("Question: Victim of the perfect murder.", THREAD, undefined, {
      answer: answer(
        "The victim in that novel is Norton (the solution for this block), and the TOMI field is one of the hints Poirot left, which was Othello.",
        THREAD,
      ),
    }),
    official(
      "Again surviving longer than expected. Let's try a hint for this one too. Queen of crime.",
      AUTHOR_COMMENT,
    ),
    official(
      "Second hint live now: Who would be smart enough to pull off the perfect murder?",
      AUTHOR_COMMENT_2,
    ),
  ],
  solvedAt: "2019-05-03 21:45:09",
  solveTime: 165_782,
  transactions: [
    funding(
      "d3515e508f308639325ea8d76423ccc66d021fa6f13e8a2b09e1b0a7684cf952",
      "2019-05-01 23:42:07",
      0.011,
    ),
    claim(
      "cc9570322c10e9675d62425a2302dfa0bd020c596d40eb8b6f81a937c7cd014d",
      "2019-05-03 21:45:09",
      0.01076038,
    ),
  ],
});
