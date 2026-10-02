import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 30 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bcbxb2/hard_7_mbtc_quizchain_block_30/";

/** The author's comment of April 14, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bcbxb2/comment/ekuicyf/";

/**
 * Quizchain block 30: the first block with a BotFU field: two words for 4231, the field, two more
 * words and the last three characters of the block 29 key, hashed with MD5 into BIP39 entropy. The
 * author printed the whole string and, in a comment, the whole hash. No source printed the key.
 */
export const quizchainBlock30 = puzzle({
  id: "quizchain/30",
  chain: "bitcoin",
  address: "1AuvqSGzUigkswAunNNiBFYVZh1L2Jv2ZB",
  sourceUrl: THREAD,
  startedAt: "2019-04-12 10:29:44",
  status: Status.Solved,
  pubkey: compressed("026e8c8947914334aa286be25354d34111b2ccd7d2581fa7ef812233e6f324cf40"),
  key: wif("L3eCrvouiccM1cvmb52sZV5VtY8P5kGUkxjARjJspX1exmA1DfTS")
    .entropy(
      "8056c0a3eb19a5ef52ed6280a494ab0d",
      source(
        AUTHOR_COMMENT,
        "MD5 of the answer string the author printed, the full hash of which a comment of the author gives",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: 4231", THREAD, undefined, {
      answer: answer(
        'BFUB is "Sphinx Yang", for a complete answer string of "Humanity First BotFU Sphinx Yang JRu"',
        THREAD,
      ),
    }),
    official(
      "Format: [solution] BotFU [BotFU] [link], see example above. Hint: BotFU for this is two words, both starting with capital letters.",
      THREAD,
    ),
    official(
      "4231 is to be divided in 423 for the first word (and BFUB hint) and 1 for the second word and BFUB hint.",
      THREAD,
    ),
    official("FIrst word of BFUB is Sphinx.", THREAD),
  ],
  solvedAt: "2019-04-14 02:38:04",
  solveTime: 144_500,
  transactions: [
    funding(
      "cb3dd31d6d76ad379e04359a0be9003afcb663da12f69c85417700ad2823395f",
      "2019-04-12 10:29:44",
      0.007,
    ),
    claim(
      "28c6135326b87b411f4640c6a53974380633bd35cdccba1ab104cd79c93f682f",
      "2019-04-14 02:38:04",
      0.00673638,
    ),
  ],
});
