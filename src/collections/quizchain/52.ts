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

/** Where the question and the funding txid of block 52 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bexpni/7_mbtc_quizchain_block_52/";

/**
 * Quizchain block 52: block 49's three words and the same with `b`, then TOMI, a fixed text and the
 * last seven characters of the block 51 key, hashed with MD5 into BIP39 entropy. No source printed
 * the hash or the key.
 */
export const quizchainBlock52 = puzzle({
  id: "quizchain/52",
  chain: "bitcoin",
  address: "16LnoqUzQKzirZZHpLYAYgXKc8oxt4QcDh",
  sourceUrl: THREAD,
  startedAt: "2019-04-19 11:45:37",
  status: Status.Solved,
  pubkey: compressed("03c0bbe3141e477a24cc18934b58e381c14c6b0db4f0685993bd9880b1db5bd032"),
  key: wif("KzhD1fznCzyo1Y3x59QRuQ1x98xPH24YCGCsA5wAVZu7tY1ui6qG")
    .entropy(
      "f842deb0f23a320db6b7012cb4794c0f",
      source(
        THREAD,
        "MD5 of the six words, TOMI, the fixed text and the last seven characters of the block 51 key",
      ),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official(
      "Question: Six three letter words. They need to be in the right order.",
      THREAD,
      undefined,
      {
        answer: answer("Solution was hat hot hit bat bot bit.", THREAD),
      },
    ),
    official("Format: [solution] TOMI means wealth. I hope you find it. [link]", THREAD),
  ],
  solvedAt: "2019-04-19 15:20:49",
  solveTime: 12_912,
  transactions: [
    funding(
      "7968863320ed12402fa6846da5a245c13b4ec08d9b97c16b484d026f44364dd3",
      "2019-04-19 11:45:37",
      0.007,
    ),
    claim(
      "744df89e81b0f21ab46f2123033476bb971c5e7604a3733739e9278b2cc0021c",
      "2019-04-19 15:20:49",
      0.00677171,
    ),
  ],
});
