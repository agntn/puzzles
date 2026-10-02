import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 54 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bfckvs/7_mbtc_quizchain_block_54_1_of_3/";

/** The author's Wattpad chapter Complete Quizchain, with the question and solution of every first run block. */
const SOLUTIONS = "https://www.wattpad.com/720895205-second-complete-quizchain";

/** The author's comment of April 22, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bfckvs/comment/elh9r18/";

/**
 * Quizchain block 54: four words built like block 52's with an extra `n`, then TOMI, a fixed text
 * and a link of seven characters the post set, hashed with MD5 into BIP39 entropy. The thread never
 * got the answer. Only the author's Wattpad list of first run solutions has it. No source printed
 * the hash or the key.
 */
export const quizchainBlock54 = puzzle({
  id: "quizchain/54",
  chain: "bitcoin",
  address: "1BeowfUYwrwqopnKzK36u4Birp2RGbfVDq",
  sourceUrl: THREAD,
  startedAt: "2019-04-20 14:34:50",
  status: Status.Solved,
  pubkey: compressed("02489f31f09e6037ef6a0d99d8e19417244856d3115d69b5e707f77b4e2c23dd8c"),
  key: wif("KyiauuxwBKgg8HVk9HZj7tTMWvudJ2aBMTrRrTVY5MC1f9iSUoC9")
    .entropy(
      "917ab0a81f2d6d1ede67cd324e96ed9e",
      source(SOLUTIONS, "MD5 of the four words, TOMI, the fixed text and the link the post set"),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official(
      "Question: I am looking for 4 four letter words. Most relevant first. No words of dubious moral value in this list.",
      THREAD,
      undefined,
      {
        answer: answer("hint hunt bent bunt", SOLUTIONS),
      },
    ),
    official("Format: [word1 word2 word3 word 4] TOMI Thank you for playing. NRqEsd7", THREAD),
    official(
      "Another hint, this is same principle as block 52, only with an extra n, like hint instead of hit.",
      AUTHOR_COMMENT,
    ),
  ],
  solvedAt: "2019-04-20 23:28:20",
  solveTime: 32_010,
  transactions: [
    funding(
      "7f76d80dcd6a1c80a9d5599d5fdfaa3c44f1463e09f286a0f5cfedd9692e2f43",
      "2019-04-20 14:34:50",
      0.007,
    ),
    claim(
      "8308f4aab13c15f9416fd62d765eebfbf46cb7c76399c8a8eb6293602594f9f2",
      "2019-04-20 23:28:20",
      0.00681357,
    ),
  ],
});
