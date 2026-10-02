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

/** Where the question and the funding txid of block 55 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bfinky/7_mbtc_quizchain_block_55_2_of_3/";

/** The author's Wattpad chapter Complete Quizchain, with the question and solution of every first run block. */
const SOLUTIONS = "https://www.wattpad.com/720895205-second-complete-quizchain";

/**
 * Quizchain block 55: `Hoax`, the fixed text and the last seven characters of the block 54 key,
 * hashed with MD5 into BIP39 entropy. The author dropped the word TOMI from the hash, and a player
 * claimed it anyway 66 minutes after funding. The author later printed the WIF in a comment.
 */
export const quizchainBlock55 = puzzle({
  id: "quizchain/55",
  chain: "bitcoin",
  address: "1FJxZ12FN54q8tKkSpBxtefbsmT3F5Zhi1",
  sourceUrl: THREAD,
  startedAt: "2019-04-20 23:36:31",
  status: Status.Solved,
  pubkey: compressed("02cd94d11582c86a752ed3fad0898308375448db3b39098bdaf60a91649015617a"),
  key: wif("KzpmhuRUrZ2taXERxT5gAvXWGGXuKLku7yEokjMEBLvDP64bSJfY").entropy(
    "93d69616a17017df42c9f9683e4c0365",
    source(
      THREAD,
      "MD5 of the word, the fixed text and the last seven characters of the block 54 key, without the TOMI the format asked for",
    ),
  ),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Do you know another four letter word?", THREAD, undefined, {
      answer: answer("Hoax TOMI No, not that kind of four letter word", SOLUTIONS),
    }),
    official(
      "Format: [solution] TOMI No, not that kind of four letter word. [link]",
      THREAD,
      undefined,
      {
        answer: answer(
          'I somehow managed to drop the "TOMI" part, hashed with the string "Hoax No, not that kind of four letter word. 9iSUoC9".',
          THREAD,
        ),
      },
    ),
    official("Link not provided, you need to solve 54 to get it.", THREAD),
  ],
  solvedAt: "2019-04-21 00:42:47",
  solveTime: 3976,
  transactions: [
    funding(
      "8d317963ba469c5002ef313303ece06b94f2833e4b460b6dcb03856ff200be68",
      "2019-04-20 23:36:31",
      0.007,
    ),
    claim(
      "e258d5f866ce4bc26e58b0bb15b4e9ad475c148e46ab229cb080ee2e2f529eed",
      "2019-04-21 00:42:47",
      0.00681357,
    ),
  ],
});
