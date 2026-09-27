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

/** Where the question and the funding txid of block 63 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bgqkw5/7_mbtc_quizchain_block_63/";

/** The author's Wattpad chapter Welcome to the Quizchain, which works block 63 through in full. */
const WELCOME = "https://www.wattpad.com/717956015-second-welcome-to-the-quizchain";

/**
 * Quizchain block 63: how Wikipedia addresses Alistair Darling, Chancellor on the day of the
 * genesis block, then TOMI, a fixed text and the whole block 62 key, hashed with MD5 into BIP39
 * entropy. The author's Wattpad chapter Welcome to the Quizchain prints the whole string. No source
 * printed the hash or the key.
 */
export const quizchainBlock63 = bitcoinPuzzle({
  id: "quizchain/63",
  address: p2pkh("1Q92bSL9p69qBf3QP4W9AgHgXGmB2AvTcP", "fdcf8d1541732117871b3ffc4bda1b94bf521240"),
  sourceUrl: THREAD,
  startedAt: "2019-04-24 04:59:50",
  status: Status.Solved,
  pubkey: compressed("038f7ec4183ff0afcf5295b08399d51a4ce3c3bae89bfb58d62826aaff7a15356e"),
  key: wif("KwSUuGPC1wtLLDarpbeQaJhKnii848czbfbxXnGiwwND5ko6B5GS")
    .entropy(
      "888b04c435e075e5c6044a2bd97f46de",
      source(
        WELCOME,
        "MD5 of the full string the author's Wattpad chapter prints: the form of address, TOMI, the fixed text and the whole block 62 key",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("How should I call you, darling?", THREAD, undefined, {
      answer: answer(
        "The Rt Hon Alistair Darling MP TOMI If you don't get this, sorry, it is hard L4GWDy9Ld3ZydGCtFaHaaDEJe4YL5hAiSLsLgGzdEVQkNWgZUqu3",
        WELCOME,
      ),
    }),
    official("Format: [solution] TOMI If you don't get this, sorry, it is hard [link]", THREAD),
    official(
      "Link is all digits of private key for block 62, which starts with L4G and ends in qe3.",
      THREAD,
    ),
    official("Update: Block 62 private key ends with qu3, not qe3.", THREAD),
  ],
  solvedAt: "2019-04-24 13:34:26",
  solveTime: 30_876,
  transactions: [
    funding(
      "34df681625c66a690d44e527ec8d0f96ec700f98b3105caa516d29217cd56a0e",
      "2019-04-24 04:59:50",
      0.007,
    ),
    claim(
      "96d7e94ef2d02c9fbd6d2cc71da384a50dd046890f3aa2881362aed4a9bfbb4b",
      "2019-04-24 13:34:26",
      0.00671272,
    ),
  ],
});
