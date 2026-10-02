import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 22 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bbukyu/easy_7_mbtc_quizchain_block_22/";

/**
 * Quizchain block 22: three words for A, O and I, a space and the last three characters of the
 * block 21 key, hashed with MD5 into BIP39 entropy. The author again sent the previous tail to the
 * commenter with the committed answer. No source printed the hash or the key.
 */
export const quizchainBlock22 = puzzle({
  id: "quizchain/22",
  chain: "bitcoin",
  address: "162P5AFJRMiYB68axzGM9BWQ3UHVxJJpax",
  sourceUrl: THREAD,
  startedAt: "2019-04-11 01:52:50",
  status: Status.Solved,
  pubkey: compressed("039ff824ea21bc861419c189f123c0517fa2e6f554440db6587a2afbcbcfdaf945"),
  key: wif("L2c8CZiQGXxpsb4G2HJ2EptQSCumogW7n88XjBnpwiRkLEhMcCGD")
    .entropy(
      "c286981eaf9c214bdc8ed460df3bd589",
      source(
        THREAD,
        "MD5 of the three words, a space and the last three characters of the block 21 key",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official(
      "Question: You start out with A O I. Which three words do you expand that to (only English words allowed, all words starting with capital letter).",
      THREAD,
      undefined,
      {
        answer: answer(
          "Update: This block has been solved, solution was Artificial Overlord Intelligence.",
          THREAD,
        ),
      },
    ),
    official(
      "Format: [word1 word2 word3] [link] with exactly one space between three words and link.",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-11 05:29:57",
  solveTime: 13_027,
  transactions: [
    funding(
      "2c2cd07ca9718f42f9b1f409125a48301ff50bb20d9350a6bfcbcf5e45659892",
      "2019-04-11 01:52:50",
      0.007,
    ),
    claim(
      "82160a0b3b869abd2a30bcc30b5834b95bf0b5e1b4912655a4940e28ce717fd1",
      "2019-04-11 05:29:57",
      0.00679648,
    ),
  ],
});
