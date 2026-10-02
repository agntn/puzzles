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

/** Where the question and the funding txid of block 76 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bk27y7/76_mbtc_quizchain_block_76/";

/** The author's comment of May 6, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bk27y7/comment/emn4owv/";

/**
 * Quizchain block 76: the feast of Jesus's second life, TOMI, `Second Life` and the whole block 75
 * key, hashed with MD5 into BIP39 entropy, for 76 mBTC. The author's Wattpad copy of the second run
 * prints the WIF as the link inside a later block's string.
 */
export const quizchainBlock76 = puzzle({
  id: "quizchain/76",
  chain: "bitcoin",
  address: "1LZZtbS91P4h5QYdTiTm8dChfLcb1gtwRe",
  sourceUrl: THREAD,
  startedAt: "2019-05-03 00:42:41",
  status: Status.Solved,
  pubkey: compressed("03ba25685ae0491a4999ef81d0d0ce33041dee41ace9e75a72d21677f7b5e2c1c6"),
  key: wif("L2e6gPSXnq7KJBfkoD7cHGVZuhRUDARJz2Cc9JcSNLsKRZhH552F").entropy(
    "3d5823ea1088774b53558624060cf473",
    source(THREAD, "MD5 of the feast, TOMI, two words and the whole block 75 key"),
  ),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.076,
  hints: [
    official("Question: Jesus", THREAD, undefined, {
      answer: answer("Solution was Easter, TOMI field was Second Life.", THREAD),
    }),
    official("Format: [solution] TOMI [TOMI] [link]", THREAD),
    official(
      "Hint live now. It is: Hint already posted SOMEWHERE in Wattpad story can't remember where",
      AUTHOR_COMMENT,
    ),
  ],
  solvedAt: "2019-05-06 13:06:24",
  solveTime: 303_823,
  transactions: [
    funding(
      "aa77bbcc7c12b67f56962676dac401caf29ff68791a4f1a669ba0b32bbb835ab",
      "2019-05-03 00:42:41",
      0.076,
    ),
    claim(
      "7bd3140da6bddaaed3c888f81b6a373a1e0bf6eac46a5d7763eceb28a6d4ef95",
      "2019-05-06 13:06:24",
      0.0758556,
    ),
  ],
});
