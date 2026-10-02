import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 50 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bel75n/7_mbtc_7_mbtc_7_mbtc_quizchain_blocks_48_to_50/";

/** The author's Wattpad chapter Complete Quizchain, with the question and solution of every first run block. */
const SOLUTIONS = "https://www.wattpad.com/720895205-second-complete-quizchain";

/** The author's comment of April 18, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bel75n/comment/el6osaa/";

/**
 * Quizchain block 50: the one blue thing on the Wattpad cover, BFUB, `key on cover` and the last
 * seven characters of the block 49 key, hashed with MD5 into BIP39 entropy. No source printed the
 * hash or the key.
 */
export const quizchainBlock50 = puzzle({
  id: "quizchain/50",
  chain: "bitcoin",
  address: "1F6HYzh2LvV2dtbWXTzMaYX3HBzBq4ZWQP",
  sourceUrl: THREAD,
  startedAt: "2019-04-18 06:35:53",
  status: Status.Solved,
  pubkey: compressed("0334a418802ec21adb9067931492d8c72f25e7f774649c5e662d0f25329d24b371"),
  key: wif("L1xqxAzUwxugRkyo8rn3qnccTKNsaQE5y22pLzSqaKhAJzGVQQgk")
    .entropy(
      "f7d43d07a160320fd9d9e098bacd9842",
      source(
        THREAD,
        "MD5 of the colour, BFUB, three words about the Wattpad cover and the last seven characters of the block 49 key",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: Multiple choice a) blue b) green c) red d) yellow", THREAD, undefined, {
      answer: answer("Solution: blue BFUB key on cover", SOLUTIONS),
    }),
    official("Format: [solution] TOMI [TOMI] [link]", THREAD),
    official("Change TOMI to BFUB when hashing.", AUTHOR_COMMENT),
    official("TOMI format is [word1 word2 word3], with all words lower case.", THREAD),
  ],
  solvedAt: "2019-04-18 20:47:20",
  solveTime: 51_087,
  transactions: [
    funding(
      "1873629ecccf23b2d2cdd30bc337c925f818e6bc0e5c8424f96d1216022c5102",
      "2019-04-18 06:35:53",
      0.007,
    ),
    claim(
      "2e926ae9a83c36473d448ea7792aedf6bd621a09e31673a997bce114da548b7f",
      "2019-04-18 20:47:20",
      0.00690418,
    ),
  ],
});
