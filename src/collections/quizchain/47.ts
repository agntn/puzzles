import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 47 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bdrcj7/7_mbtc_7_mbtc_11_mbtc_quizchain_blocks_45_to_47/";

/** u/Randomiser's comment of April 21, 2019 in the thread. */
const PLAYER_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bdrcj7/comment/elemz19/";

/**
 * Quizchain block 47: the cross sum of 1231, BFUB, `cross sum` and the last seven characters of the
 * block 46 key, hashed with MD5 into BIP39 entropy, for 11 mBTC. It held five days. No source
 * printed the hash or the key.
 */
export const quizchainBlock47 = puzzle({
  id: "quizchain/47",
  chain: "bitcoin",
  address: "1J3sbaFiSpXgK49nBxonuLMqRw5H8K9wkk",
  sourceUrl: THREAD,
  startedAt: "2019-04-16 03:35:37",
  status: Status.Solved,
  pubkey: compressed("037690efde51280c48e3fa7aec3eff86887a10e1b3438b26b2fb8b5b1f1a1cd926"),
  key: wif("L54ym5FMKYsoLK48wMXoprMNV19kjTE8kDqUk5Hm5bih5P5fCnpv")
    .entropy(
      "b90d7abff767a00f34fdddd2f067f6d0",
      source(
        THREAD,
        "MD5 of the cross sum, BFUB, the two words and the last seven characters of the block 46 key, separated by spaces",
      ),
    )
    .derived(),
  prize: 0.011,
  hints: [
    official("Question: Another difficult math problem. 1231", THREAD, undefined, {
      answer: answer(
        "The solution was rather simple. Only one digit, the number 7, as the cross sum of the number posted in the question.",
        THREAD,
      ),
    }),
    official(
      "BFUB will be four or less words, all of them lower case and seperated by one space, if there are two or more.",
      THREAD,
      undefined,
      {
        answer: answer('"7 BFUB cross sum adyH5bR"', PLAYER_COMMENT),
      },
    ),
    official("First two digits of hash: b9", THREAD),
  ],
  solvedAt: "2019-04-21 05:56:37",
  solveTime: 440_460,
  transactions: [
    funding(
      "f0e7f3f0fa053d4c05354eab666e99a0e40a4475ed098b5473759ce93b41b92e",
      "2019-04-16 03:35:37",
      0.011,
    ),
    claim(
      "9ffd2697c07f5761775d18fe445647f4e6e8f92591d7b571c02c88652bc4fca1",
      "2019-04-21 05:56:37",
      0.01082144,
    ),
  ],
});
