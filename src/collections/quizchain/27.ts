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

/** Where the question and the funding txid of block 27 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bbyxd4/medium_9_mbtc_quizchain_block_27/";

/** The author's Wattpad chapter Complete Quizchain, with the question and solution of every first run block. */
const SOLUTIONS = "https://www.wattpad.com/720895205-second-complete-quizchain";

/**
 * Quizchain block 27: a gambler's name, a space and the last three characters of the block 26 key,
 * hashed with MD5 into BIP39 entropy. The 9 mBTC went in 24 minutes and the author suspected brute
 * force. The name is in the Wattpad solutions. No source printed the hash or the key.
 */
export const quizchainBlock27 = bitcoinPuzzle({
  id: "quizchain/27",
  address: p2pkh("1AmV6X4XUpekJPqp3smcCN9HAcdcLMsviw", "6b22e3138b4b733a89c7f43913d0ab07fe973f6e"),
  sourceUrl: THREAD,
  startedAt: "2019-04-11 11:42:08",
  status: Status.Solved,
  pubkey: compressed("0245ce2a927a35a34b4fd506659d4a320657ad104860d87b0eb4cdda8957b620e5"),
  key: wif("L4HGPUrxBkveqcevHh54btCFqupm4XhnH1ZFiajTBfPv4kS8NMA2")
    .entropy(
      "60f7bf883202ac8998ab38b79e3edade",
      source(THREAD, "MD5 of the name, a space and the last three characters of the block 26 key"),
    )
    .derived(),
  prize: 0.009,
  hints: [
    official("Question: I am looking for the name of a gambler.", THREAD, undefined, {
      answer: answer("James Bond.", SOLUTIONS),
    }),
    official("Format: [first name] [family name] [link] with one space between each.", THREAD),
    official(
      "Only one thing now: Neither block 17 nor block 7 has anything to do with the solution.",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-11 12:06:01",
  solveTime: 1433,
  transactions: [
    funding(
      "e938ba701144731be470e2060bba8219e9d2d2a9785e09d64092feb9e6ce563c",
      "2019-04-11 11:42:08",
      0.009,
    ),
    claim(
      "b70aa7492b70cf95a9997fce8bb765bff6a18f3cc0dda53d78c4c46a11d0d5e6",
      "2019-04-11 12:06:01",
      0.00867917,
    ),
  ],
});
