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

/** Where the question and the funding txid of block 42 were published. */
const THREAD = "https://www.reddit.com/r/u_AoiNakamoto/comments/bddbd5/7_mbtc_quizchain_block_42/";

/** The author's Wattpad chapter Complete Quizchain, with the question and solution of every first run block. */
const SOLUTIONS = "https://www.wattpad.com/720895205-second-complete-quizchain";

/**
 * Quizchain block 42: the number 42 in quotation marks, BFUB, `quotation marks` and the last three
 * characters of the block 41 key, hashed with MD5 into BIP39 entropy. The surviving post sits on
 * the author's profile, and the author wrote that Reddit had removed it. It held for three days. A
 * player printed the string and the WIF weeks later.
 */
export const quizchainBlock42 = bitcoinPuzzle({
  id: "quizchain/42",
  address: p2pkh("18S29pV8hUTBJ8qeudtREvNqkFUNULSSj3", "51843dc0065ffca0a0e2e4215409424b26ceab5d"),
  sourceUrl: THREAD,
  startedAt: "2019-04-15 06:33:03",
  status: Status.Solved,
  pubkey: compressed("025e44cd99b82b7bfcc1995c15fab7fa7a10a188df3e56a782be004d22b7a0ff50"),
  key: wif("L2htXn27ZGqymXMa6iz6x3y2CiYtFXooi1DQJidswTwhvWFdLUvY").entropy(
    "c8f0c41c4595f41b80b58d8311492a02",
    source(
      THREAD,
      "MD5 of the quoted number, BFUB, the two words and the last three characters of the block 41 key, printed by a player with the key",
    ),
  ),
  prize: 0.007,
  hints: [
    official(
      "Question: Of course you all knew the solution to this for a long time. But do you guess the slight twist on it?",
      THREAD,
      undefined,
      {
        answer: answer('"42" BFUB quotation marks', SOLUTIONS),
      },
    ),
    official(
      "BFUB is in the format [word1] [word2] both in lowercase, with one space in between. If you guess the twist on the solution, BFUB should be easy.",
      THREAD,
    ),
    official("Link from previous block is emF. First two digits of hash is c8.", THREAD),
  ],
  solvedAt: "2019-04-18 13:33:29",
  solveTime: 284_426,
  transactions: [
    funding(
      "2fbcb042b52bf00921020393788f02c026873160cd51e216fbd826cdeed12fae",
      "2019-04-15 06:33:03",
      0.007,
    ),
    claim(
      "6f0c1edcf603f6f498b2a1671fa7949662762f541a21692b2f1549aeeb7e0d3a",
      "2019-04-18 13:33:29",
      0.00689248,
    ),
  ],
});
