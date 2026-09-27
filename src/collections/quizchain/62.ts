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

/** Where the question and the funding txid of block 62 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bgo23n/7_mbtc_quizchain_block_62/";

/**
 * Quizchain block 62: `wizard`, TOMI, `Atbash` and the whole block 61 key, hashed with MD5 into
 * BIP39 entropy. A player printed the WIF in the block 63 thread, and the author's Wattpad chapter
 * prints it inside block 63's string.
 */
export const quizchainBlock62 = bitcoinPuzzle({
  id: "quizchain/62",
  address: p2pkh("1Apq1oxG8njoK2opp1PWBxWghc1TnQWnEq", "6bc4c32586644f739f5553c9003f6ba38985e5d5"),
  sourceUrl: THREAD,
  startedAt: "2019-04-24 00:39:38",
  status: Status.Solved,
  pubkey: compressed("038ed73c809d225015190102a080affcbc917ecc325319dca16af8c7ca298f08ba"),
  key: wif("L4GWDy9Ld3ZydGCtFaHaaDEJe4YL5hAiSLsLgGzdEVQkNWgZUqu3").entropy(
    "ddd06ba8a5eebb2988a97be8d0b5b7c6",
    source(THREAD, "MD5 of the word, TOMI, the cipher and the whole block 61 key"),
  ),
  prize: 0.007,
  hints: [
    official("Question: Six letter word.", THREAD, undefined, {
      answer: answer(
        "The hint to the Wattpad story was relevant because of the word I was looking for was wizard. But the TOMI field was exactly the same as in block 61.",
        THREAD,
      ),
    }),
    official(
      "Word in solution is lower case. [link] is whole private key for block 61, not only last 7 digits.",
      THREAD,
    ),
    official("Hint for this is available in the update to the Wattpad story, chapter one.", THREAD),
  ],
  solvedAt: "2019-04-24 02:58:53",
  solveTime: 8355,
  transactions: [
    funding(
      "bec82669a5db4127581aee1639c0f0fbb0d37598b5d04207b4006c19f71490a2",
      "2019-04-24 00:39:38",
      0.007,
    ),
    claim(
      "970e5246c570aec25e153ccc3853478809c04f636bd6ed00706a7447a6e8d327",
      "2019-04-24 02:58:53",
      0.00671424,
    ),
  ],
});
