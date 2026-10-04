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

/** The block 65 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/cbt0ej/7_mbtc_quizchain2_block_65/";

/** u/puzzleponky's comment with the solution and the tweet it came from. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/cbt0ej/comment/ethzmx4/";

/** Quizchain2 block 65: `layer`, the second layer from the author's tweet, with Grycoin as the TOMI field. */
export const quizchain2Block65 = puzzle({
  id: "quizchain2/65",
  chain: "bitcoin",
  address: "1JcB65PrSGheTzrQLXPH3vTBRDGPtnqgBR",
  sourceUrl: THREAD,
  startedAt: "2019-07-11 04:46:31",
  status: Status.Solved,
  pubkey: compressed("027da4330d91a3076ea9df3b9e809e92fdd1c93cbc74264279a98a1087d5c0c65b"),
  key: wif("Kyciwwnxcpi5onoSC5aMtfSMLqg686EFfgfokxTHxReFmi8QWDuZ")
    .entropy("921010c69200b35e14be1829bb9cbd98", source(THREAD, "MD5 of the word, TOMI and a word"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Second", THREAD, undefined, {
      answer: answer('Solution was "layer" and TOMI was "Grycoin".', THREAD),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer('full solution is: "layer TOMI Grycoin"', PLAYER_COMMENT),
    }),
    official(
      'Solution is one word in lower case and TOMI field is one word starting with a capital letter, like "Bitcoin".',
      THREAD,
    ),
    official("First three digits of MD5 hash are 921.", THREAD),
  ],
  solvedAt: "2019-07-11 08:10:01",
  solveTime: 12210,
  transactions: [
    funding(
      "8e03f34b3a966abf163d11c7da11987e1d5037c8fe4d252d4d096e5400657b0e",
      "2019-07-11 04:46:31",
      0.007,
    ),
    claim(
      "3cc22c53135939d694eee1124e469dcabf81d0949a51c6a678504531eb909a7b",
      "2019-07-11 08:10:01",
      0.00681261,
    ),
  ],
});
