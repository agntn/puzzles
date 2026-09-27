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

/** Where the question and the funding txid of block 21 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bbsqhh/hard_7_mbtc_quizchain_block_21/";

/** u/mapl3sn0w's comment of April 11, 2019 in the thread. */
const PLAYER_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bbsqhh/comment/eklsc8n/";

/**
 * Quizchain block 21: block 1's answer with `succed` fixed to `succeed`, a space and the last three
 * characters of the block 20 key, hashed with MD5 into BIP39 entropy. The author sent the block 20
 * tail privately to the first correct comment. The update quotes the answer as "Satoshi was an".
 * The comment the author accepted and the funded hash both say "Satoshi is an". No source printed
 * the hash or the key.
 */
export const quizchainBlock21 = bitcoinPuzzle({
  id: "quizchain/21",
  address: p2pkh("12HDDSxU6F9crKJycdjWxKG1VaRRZS1ntA", "0e08fa38070945e94f7ef75e9717a62f2aadca28"),
  sourceUrl: THREAD,
  startedAt: "2019-04-10 23:00:17",
  status: Status.Solved,
  pubkey: compressed("03705edd25c815b6198081214ee51b9316b90336bb8d7370f90657e2c28f57041f"),
  key: wif("L2oifBMUMLorrW27SEt1bV8kx4Mvk6aP3AnfERe7jbPpNyVdk7ww")
    .entropy(
      "f04fdf06bbcabd95413cc5488aef0b0d",
      source(
        THREAD,
        "MD5 of the block 1 answer with its typo fixed, a space and the last three characters of the block 20 key",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official(
      "Question: Can you find the solution with absolutely no hint whatsoever?",
      THREAD,
      undefined,
      {
        answer: answer(
          "Satoshi is an anonymous cypherpunk and the first one to succeed building private Internet cash.",
          PLAYER_COMMENT,
        ),
      },
    ),
    official("Format: [solution] [link] with exactly one space between them.", THREAD),
    official(
      "Please post your best solution to the comments. I will send the link code from the unsolved previous post privately to the commenter if and only if one of the solutions is correct.",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-11 04:13:45",
  solveTime: 18_808,
  transactions: [
    funding(
      "f2e3d1562bf103b90da495076dc32f7df04ed03791b73d9603f6000da819121c",
      "2019-04-10 23:00:17",
      0.007,
    ),
    claim(
      "7d4be0b2af774f166562ff68cb0c4c8c53ced4f65c75f8a4118ae46b270b7e9f",
      "2019-04-11 04:13:45",
      0.00669771,
    ),
  ],
});
