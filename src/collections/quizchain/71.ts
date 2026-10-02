import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 71 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/biww11/8mbtc_quizchain_block_71/";

/** The author's Wattpad chapter Complete Quizchain, with the question and solution of every first run block. */
const SOLUTIONS = "https://www.wattpad.com/720895205-second-complete-quizchain";

/** The author's comment of April 30, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/biww11/comment/em4v010/";

/**
 * Quizchain block 71: the password Merry's idea opened in Lord of the Rings, TOMI, `Gandalf` and
 * the whole block 70 key, hashed with MD5 into BIP39 entropy, for 8 mBTC. A player printed the WIF
 * in the block 72 thread.
 */
export const quizchainBlock71 = puzzle({
  id: "quizchain/71",
  chain: "bitcoin",
  address: "1C5P5dfq4nWqhcRDkSCWJKy3S1YzmdyK7U",
  sourceUrl: THREAD,
  startedAt: "2019-04-30 00:33:12",
  status: Status.Solved,
  pubkey: compressed("037a6dbafdd95c8761d0a73ed433048d9b0b63f9e4b095700445a909ebadecf15e"),
  key: wif("KxQGi7WXnWzG33SKK288AWmCc3LBC2V86ts2ZG4ESH8c6xPvBo8h").entropy(
    "d6afff13ce667d4ad13d0c3899b8cbeb",
    source(THREAD, "MD5 of the password, TOMI, the wizard and the whole block 70 key"),
  ),
  prize: 0.008,
  hints: [
    official("Question: merry idea", THREAD, undefined, {
      answer: answer('The solution was "Mellon TOMI Gandalf".', SOLUTIONS),
    }),
    official("Format [solution] TOMI [TOMI] [link]", THREAD),
    official("Hint for TOMI field live now at Twitter feed. It is grey", AUTHOR_COMMENT),
  ],
  solvedAt: "2019-04-30 14:39:39",
  solveTime: 50_787,
  transactions: [
    funding(
      "4a75013a72e9dff0fa376abd16b818dd51a80a1e071914da9e7e1765feba862e",
      "2019-04-30 00:33:12",
      0.008,
    ),
    claim(
      "998f865c2e2dea414246fe1e6fa1cbf58099542fde565be44b835844cba7bc05",
      "2019-04-30 14:39:39",
      0.00788115,
    ),
  ],
});
