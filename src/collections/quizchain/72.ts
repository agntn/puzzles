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

/** Where the question and the funding txid of block 72 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bj25fm/9_mbtc_quizchain_block_72/";

/** The author's comment of May 1, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bj25fm/comment/em9o86o/";

/** The author's comment of May 2, 2019 in the thread. */
const AUTHOR_COMMENT_2 = "https://www.reddit.com/r/bitcoinpuzzles/comments/bj25fm/comment/emb6oc1/";

/**
 * Quizchain block 72: `block` with its `b` moved one letter on, then TOMI, `c after b` and the
 * whole block 71 key, hashed with MD5 into BIP39 entropy, for 9 mBTC. A player printed the WIF in
 * the block 73 thread.
 */
export const quizchainBlock72 = puzzle({
  id: "quizchain/72",
  chain: "bitcoin",
  address: "1HYrKjBry5X252RWgeiijEg4hAsyn7Ya6a",
  sourceUrl: THREAD,
  startedAt: "2019-04-30 12:05:28",
  status: Status.Solved,
  pubkey: compressed("03ac1881927c1e795bd90bc0d2602404af39a771c9bef6ba786f22b37a442cdf25"),
  key: wif("L1NvACvyh4cNS5mTM4k8PnJphdBcdBWrU1EzcPZttaj9UHWD2xAT").entropy(
    "a500b37a9661d9e7956773516edc22ba",
    source(THREAD, "MD5 of the word, TOMI, three words and the whole block 71 key"),
  ),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.009,
  hints: [
    official("Question: After the block", THREAD, undefined, {
      answer: answer(
        'Solution was "clock", TOMI was "c after b" to indicate that only one letter is replaced with the one after it in the alphabet.',
        THREAD,
      ),
    }),
    official("Hint live now at Twitter feed. It is 3145", AUTHOR_COMMENT),
    official(
      "This is hint at the solution method, which is similar to blocks 31 and 45. TOMI field has three elements, one of them also in the question.",
      AUTHOR_COMMENT_2,
    ),
  ],
  solvedAt: "2019-05-02 13:10:46",
  solveTime: 176_718,
  transactions: [
    funding(
      "eb82b68f72db273bc7cd5b814f706d6367b6f55342151b62c65a97819d41a029",
      "2019-04-30 12:05:28",
      0.009,
    ),
    claim(
      "09a9bbc65c488af07f68bebf6bd62c052b7e92b8a966dcc8efba0f76f45e9138",
      "2019-05-02 13:10:46",
      0.00890796,
    ),
  ],
});
