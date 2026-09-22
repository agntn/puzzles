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

/** Where the recipe, the funding txid, the solution and the private key of block 3 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bae43s/easy_7_mbtc_quizchain_block_3/";

/**
 * Quizchain block 3: a random three digit number with the last three characters of the block 2
 * key appended, hashed with SHA-256 into BIP39 entropy. The post names the funding transaction,
 * not the address, and the author edited the number and the private key into it. The entropy
 * hash is not printed; it is the post's recipe run on the published solution, and it derives
 * that key.
 */
export const quizchainBlock3 = bitcoinPuzzle({
  id: "quizchain/3",
  address: p2pkh("1Nsi6LxpKqg5CDVrswn6YPNQaGBhdhUCMs", "eff1bdd59bfa0635856eb7dd7b4cfc7ddf4d01d5"),
  sourceUrl: THREAD,
  startedAt: "2019-04-07 07:51:08",
  status: Status.Solved,
  pubkey: compressed("028faeaeb616580d0b710d6ab4bb625fe157f3a2aaf393df3ac653df8f3a90e58f"),
  key: wif("KxN3DX8bKLTMNhppf6FqjvCKaLBCi5mN5vGyVNQRUxjdwt4o683S").entropy(
    "4b1f87124aa427ca3f7e7dbf3d8ee8bf7e3985c488be5d7d53e65119b631d743",
    source(
      THREAD,
      "SHA-256 of the random number with the last three characters of the block 2 key appended",
    ),
  ),
  prize: 0.007,
  hints: [
    official("First part: Pick a random 3 digit number.", THREAD, undefined, {
      answer: answer("777", THREAD),
    }),
    official("Second part: Last three digits of the private key of block 2.", THREAD, undefined, {
      answer: answer("hBF", THREAD),
    }),
    official(
      "Combine both parts, take SHA 256 hash of that and input the result as entropy in the Ian Coleman brain wallet tool.",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-07 08:01:41",
  solveTime: 633,
  transactions: [
    funding(
      "e6aa641de6fffe6b15d96492069bb6b1ee130a5b89e37e02a2919f10822fc93a",
      "2019-04-07 07:51:08",
      0.007,
    ),
    claim(
      "75e81859b409270a378eface94174c635b2575da7aa0a8def53e7228c33f641c",
      "2019-04-07 08:01:41",
      0.00672314,
    ),
  ],
});
