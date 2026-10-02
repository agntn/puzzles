import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 31 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bckvv9/easy_7_mbtc_quizchain_block_31/";

/**
 * Quizchain block 31: the first block with the brute force user block, BFUB: one letter, the field,
 * a hint of two words and the last three characters of the block 30 key, hashed with MD5 into BIP39
 * entropy. The post printed the first two hash digits. No source printed the hash or the key.
 */
export const quizchainBlock31 = puzzle({
  id: "quizchain/31",
  chain: "bitcoin",
  address: "1UQPCtfgohV2trpRfcgcNgTxEyUsT7AQf",
  sourceUrl: THREAD,
  startedAt: "2019-04-13 00:12:25",
  status: Status.Solved,
  pubkey: compressed("02511924b3c1ba1e38dcc211d55cde81582e6df5a3a2cfe7824fbfc43a822c055f"),
  key: wif("L51KtCtDoT28gTj335pW6Z7zbDY5m2RbsZiCQhNfbMRNeGpaH3NJ")
    .entropy(
      "26c9d319d4423d2555501d9ca0843af5",
      source(
        THREAD,
        "MD5 of the letter, the BFUB field and the last three characters of the block 30 key, separated by spaces",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: BItcoin Second", THREAD, undefined, {
      answer: answer("Solution:  A.   (one capital letter).", THREAD),
    }),
    official(
      "Format: [solution] BFUB [BFUB] [link] with exactly one space between them and all words in answer capitalized.",
      THREAD,
      undefined,
      {
        answer: answer(
          "Finding BFUB:  working from solution, develop hint. In this case Before B.",
          THREAD,
        ),
      },
    ),
    official("Previous block link digits: fTS", THREAD),
    official(
      "First 2 digits of the hash are 26, so if you don't see those two digits, don't bother checking the BIP 39 tool.",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-13 03:54:55",
  solveTime: 13_350,
  transactions: [
    funding(
      "4431011443671bdc5cf43b83d408a205056904be5d8972173f4a0952186118c7",
      "2019-04-13 00:12:25",
      0.007,
    ),
    claim(
      "fdb692aeb01025cf4fcfbabcb2acc3f468da359d15d7b9e34e54c54ec00e6bb6",
      "2019-04-13 03:54:55",
      0.00669491,
    ),
  ],
});
