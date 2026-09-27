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

/** Where the question and the funding txid of block 32 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bclsnu/medium_7_mbtc_quizchain_block_32/";

/**
 * Quizchain block 32: a multiple choice about Satoshi with three options, the BFUB field with a
 * hint of four words from the Wattpad story and the last three characters of the block 31 key,
 * hashed with MD5 into BIP39 entropy. No source printed the hash or the key.
 */
export const quizchainBlock32 = bitcoinPuzzle({
  id: "quizchain/32",
  address: p2pkh("1CGSo2jKDAVArPHSgmruQ3AECHMZKTHaAo", "7b95278bbdd4ca7ab4c8f3e92ef3d8c90403081b"),
  sourceUrl: THREAD,
  startedAt: "2019-04-13 01:57:23",
  status: Status.Solved,
  pubkey: compressed("039a3c1ed7f49478714874db9329d2e80b067f01ba6dac38ba07da03ebc876f091"),
  key: wif("L1eQxerFy9h8WTKtj5pATnmwVLSMtnoBp4k2ZyuswQhHu5ZvALLD")
    .entropy(
      "8be89464d9dfd717cd5b527b691aed9e",
      source(
        THREAD,
        "MD5 of the answer, BFUB, the hint and the last three characters of the block 31 key, separated by spaces",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: Satoshi Nakamoto is a) human b) AI c) no way to know", THREAD, undefined, {
      answer: answer("Solution: human", THREAD),
    }),
    official(
      "Format: [solution] BFUB [BFUB text] [link] BFUB text first word only capitalized.",
      THREAD,
      undefined,
      {
        answer: answer("BUFB Before artificial intelligence explosion", THREAD),
      },
    ),
    official("It requires reading the Wattpad story to solve the BFUB.", THREAD),
    official("Link from previous block: 3NJ First two digits of hash:8b", THREAD),
  ],
  solvedAt: "2019-04-13 09:04:46",
  solveTime: 25_643,
  transactions: [
    funding(
      "d62b83175b0959992d6890071ea741816b93d71627058443ce213eb39f8491dd",
      "2019-04-13 01:57:23",
      0.007,
    ),
    claim(
      "fde3075a8b15081c6f955d088d27960f38ab3dd15f750cc51a680b23340259c3",
      "2019-04-13 09:04:46",
      0.00669472,
    ),
  ],
});
