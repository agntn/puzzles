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

/** Where the question, the funding txid and the solution of block 5 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/boil0p/7_mbtc_quizchain2_block_5/";

/**
 * Quizchain2 block 5: five words, one per vowel, hashed with MD5 into BIP39 entropy. The funding
 * transaction sat unconfirmed for nine hours and confirmed in the same block as the claim. No
 * source printed the hash or the key.
 */
export const quizchain2Block5 = puzzle({
  id: "quizchain2/5",
  chain: "bitcoin",
  address: "18ufPz33qyBDAHxhxtAMrze5yq3abJh39b",
  sourceUrl: THREAD,
  startedAt: "2019-05-14 21:58:48",
  status: Status.Solved,
  pubkey: compressed("031b83ff60f6c90c2de6cb4c974d21d9fa45ede95d3109337a12f5e9d7693ec548"),
  key: wif("L1FbCRrq4fcMc7Lrk5avV3uGWUhtAZGyaTkqzWVdAc5NbYiyvrWJ")
    .entropy("e7a18731a7a9520baec7a428adbd50af", source(THREAD, "MD5 of the five words"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Five words.", THREAD, undefined, {
      answer: answer('Solution was "bat bot bit bet but".', THREAD),
    }),
    official("Format: [word1 word2 word3 word4 word5]", THREAD),
    official("One space between words and no period at the end.", THREAD),
    official("First three digits of MD5 hash: e7a", THREAD),
  ],
  solvedAt: "2019-05-14 21:58:48",
  solveTime: 0,
  transactions: [
    funding(
      "0dcc393425a6cd5b5266a7275e08c98fbd6c14b9b9518eb8020c34c39a655e18",
      "2019-05-14 21:58:48",
      0.007,
    ),
    claim(
      "360d1f004018776a111c17a182cbf5323c79a5abe8d829f20ddbb97825ba0da2",
      "2019-05-14 21:58:48",
      0.00695949,
    ),
  ],
});
