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

/** Where the question and the funding txid of block 24 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bbw9s3/easy_7_mbtc_quizchain_block_24/";

/**
 * Quizchain block 24: the block number read backwards, a space and the last three characters of the
 * block 23 key, `mph`, hashed with MD5 into BIP39 entropy. No source printed the hash or the key.
 */
export const quizchainBlock24 = puzzle({
  id: "quizchain/24",
  chain: "bitcoin",
  address: "1KEAu58Aee4QWaEffRgQkri6vDnBTydepP",
  sourceUrl: THREAD,
  startedAt: "2019-04-11 05:07:01",
  status: Status.Solved,
  pubkey: compressed("036ea5d8332f73b71bb260d6aed42ff5dde1a94ede2f0a1cbfdb0fae6221af2811"),
  key: wif("KyvktRtTdifj19HmNAGPwRe6mvSxcWyE9jUwk9V8nqBXMxAqCtp5")
    .entropy(
      "4834584f9ca0687697726bbf655dd681",
      source(
        THREAD,
        "MD5 of the block number read backwards, a space and the last three characters of the block 23 key the block 23 post printed",
      ),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Read backwards.", THREAD, undefined, {
      answer: answer(
        "Update: Solved. The block number 24 backwards is 42, which in turn will be the answer to block 42 as well.",
        THREAD,
      ),
    }),
    official("Format: [solution] [link] with exactly one space between.", THREAD),
  ],
  solvedAt: "2019-04-11 05:58:35",
  solveTime: 3094,
  transactions: [
    funding(
      "6ecfa33a3fbb7644d64b3cd930c9e25f4d95709daf9a45df76ba626dc3771242",
      "2019-04-11 05:07:01",
      0.007,
    ),
    claim(
      "548e8e94797c3549ef05d4d872ed8b86986ca1aa4c1b1e25149525208258fcd0",
      "2019-04-11 05:58:35",
      0.00669453,
    ),
  ],
});
