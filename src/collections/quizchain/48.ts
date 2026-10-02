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

/** Where the question and the funding txid of block 48 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bel75n/7_mbtc_7_mbtc_7_mbtc_quizchain_blocks_48_to_50/";

/**
 * Quizchain block 48: an amount and the author's favorite address, then BFUB, where the post said
 * TOMI, a fixed friendly text and the last seven characters of the block 47 key, hashed with MD5
 * into BIP39 entropy. The update spells the address with a lowercase `f` in `for`. The funded hash
 * uses the address itself, `ForPresident`. A player printed the WIF three days later.
 */
export const quizchainBlock48 = puzzle({
  id: "quizchain/48",
  chain: "bitcoin",
  address: "1AutjmfZNmdep7jFfrSEgEe4bx3qZ54k1q",
  sourceUrl: THREAD,
  startedAt: "2019-04-18 06:13:32",
  status: Status.Solved,
  pubkey: compressed("02242d744b605f1be5ab3c81830b9c563d3d17b6e4cee91f747221608a02f33138"),
  key: wif("Kyzjj1utmtTwfPCkDSCf9TwgXWESgttQ4FxAtkhDCuuMyaGBvJCf").entropy(
    "944b79dd94cc2e3db91d9348c98ebf06",
    source(
      THREAD,
      "MD5 of the amount and address, BFUB, the fixed text and the last seven characters of the block 47 key",
    ),
  ),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official(
      "Question: Like in that story, you want to send me a bribe. But you want to use Bitcoin. What amount in mbtc do you send to what address?",
      THREAD,
      undefined,
      {
        answer: answer("Solution was 0.777 mbtc 1AndrewYangforPresident2o2ozm6Pzd.", THREAD),
      },
    ),
    official(
      "Format: [solution] TOMI This one is really easy. No need to bribe anyone to get it. [link]",
      THREAD,
    ),
    official(
      "UPDATE: change all TOMI below to BFUB (legacy format). I hashed with that and changed to TOMI in post at the last minute.",
      THREAD,
    ),
    official("Link from previous block (still unsolved): P5fCnpv", THREAD),
  ],
  solvedAt: "2019-04-18 13:33:29",
  solveTime: 26_397,
  transactions: [
    funding(
      "574c8c91192669b4fc76f199ee813ee8e6883c84bfee1513062ae4a60c7647c4",
      "2019-04-18 06:13:32",
      0.007,
    ),
    claim(
      "be3486d02cb46905cd73bbcb36e17fd5793897247e18c9faf3b82165adfc33a1",
      "2019-04-18 13:33:29",
      0.00683109,
    ),
  ],
});
