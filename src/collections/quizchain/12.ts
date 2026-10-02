import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 12 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bb3n8i/easy_7_mbtc_quizchain_block_12/";

/**
 * Quizchain block 12: the two kanji parts of 和, harmony, and the last three characters of the block
 * 11 key, hashed with SHA-256 into BIP39 entropy. The author's update names the words. No source
 * printed the hash or the key.
 */
export const quizchainBlock12 = puzzle({
  id: "quizchain/12",
  chain: "bitcoin",
  address: "1H2yMvGS9AJcKCfGEYs8my7Vos5AmFDU5M",
  sourceUrl: THREAD,
  startedAt: "2019-04-09 04:24:36",
  status: Status.Solved,
  pubkey: compressed("0320823f52f8a8aea28b13407a6a4b0bc0e3b087981439a30f33a3a5b376c69c18"),
  key: wif("KzQ9SyGqQxgPpffn2dkr9EehpWZh9KnzLTf6B2QLS3YueX2okxXJ")
    .entropy(
      "6ca6570eba5f03c77e887a3a30996ea1694c3cecf3bdf22c23fe5b2b008d6a53",
      source(
        THREAD,
        "SHA-256 of the two words and the last three characters of the block 11 key, separated by spaces",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official(
      "Two words in harmony. Format: word1 word2 gFm (last block private key link).",
      THREAD,
      undefined,
      {
        answer: answer('The two words were "rice" and "mouth", which form the kanji 和.', THREAD),
      },
    ),
  ],
  solvedAt: "2019-04-09 04:50:58",
  solveTime: 1582,
  transactions: [
    funding(
      "0ee177786eb95f9c807fefd80939e38286050319b6b39f6bdcb53ce425f8ccfd",
      "2019-04-09 04:24:36",
      0.007,
    ),
    claim(
      "70f6a60db31fd9545d8f4da04ef9a84f6fe7b6f96f795f2eeb470ee3544ce234",
      "2019-04-09 04:50:58",
      0.00675592,
    ),
  ],
});
