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

/** Where the question and the funding txid of block 39 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bd2p5c/7_mbtc_quizchain_block_39/";

/**
 * Quizchain block 39: the second Bond villain, BFUB, the second letter of each word and the last
 * three characters of the block 38 key, hashed with MD5 into BIP39 entropy. It opened a chain of
 * three blocks, and a player printed the WIF when block 41 fell.
 */
export const quizchainBlock39 = puzzle({
  id: "quizchain/39",
  chain: "bitcoin",
  address: "1D35Unrf2cpiTZRwAWBYeGcdJNXm72BRNT",
  sourceUrl: THREAD,
  startedAt: "2019-04-14 12:54:32",
  status: Status.Solved,
  pubkey: compressed("038cef626d8f337c273daca714cc0d962f5b4439a77805bcdd43f023efe09570e3"),
  key: wif("Kyafo1uBuP7pRMDDdjDMjVzThitBMXaiBcbWFUYQVDg1ZowukeP8").entropy(
    "19bb929aed76a879df33689d51a76ece",
    source(
      THREAD,
      "MD5 of the villain, BFUB, the second letters of both words and the last three characters of the block 38 key, separated by spaces",
    ),
  ),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Second", THREAD, undefined, {
      answer: answer(
        "Solution was the second James Bond villain, Mr Big. And the BFUB field was derived like in the previous block, making it ri.",
        THREAD,
      ),
    }),
    official("BFUB is like last block, second letter of the words in solution.", THREAD),
    official("Last block link: B3j Hash first two digits: 19", THREAD),
  ],
  solvedAt: "2019-04-14 13:55:35",
  solveTime: 3663,
  transactions: [
    funding(
      "f1771cfeda6a98140ca72915d89cd6301f0c992e9012d3f70aea022876a869ad",
      "2019-04-14 12:54:32",
      0.007,
    ),
    claim(
      "4a76ebcd287ae8a2a53356b085d9002d2b68e0e8245b0f5a81f4ccf26eaf1809",
      "2019-04-14 13:55:35",
      0.00699155,
    ),
  ],
});
