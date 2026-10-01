import {
  answer,
  claim,
  compressed,
  funding,
  increase,
  official,
  p2pkh,
  source,
  wif,
} from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

/** Where the question, both funding txids, the hints and the solution of block 9 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bq3ptu/14_mbtc_quizchain2_block_9/";

/**
 * Quizchain2 block 9: `K-9`, the 11th letter and 9, then TOMI and two words, hashed with MD5 into
 * BIP39 entropy. The author funded the address twice by mistake, so it paid 14 mBTC, and the two
 * outputs went out in two claims thirteen minutes apart. A player printed the first ten
 * characters of the key; no source printed the hash or the whole key.
 */
export const quizchain2Block9 = bitcoinPuzzle({
  id: "quizchain2/9",
  address: p2pkh("1E3aJRAUQcW26ZYSRjR41PWTkkzgbifRAf", "8f1643c9663e1fc9f1457e82747f3c863c4da292"),
  sourceUrl: THREAD,
  startedAt: "2019-05-16 22:51:06",
  status: Status.Solved,
  pubkey: compressed("036952b20f35554e0ef24c157fae47e8a77624de86e33b7d2d6f4baf9bdc1c37c1"),
  key: wif("KyVcQKeGXypdEADis9xxTBE3Hc51YKt53kHu565JFGEn8ePmqgsf")
    .entropy(
      "92370551d3c9b67de4885578ac3291ba",
      source(THREAD, "MD5 of the code, TOMI and two words"),
    )
    .derived(),
  prize: 0.014,
  hints: [
    official("Question: 11-9", THREAD, undefined, {
      answer: answer(
        'Solution was K-9, TOMI field was police dog. Method was replacing the "K" by the number 11 because that is the place of K in the alphabet. K-9 is pronounced like "canine", which is why this code is used in many police forces.',
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD),
    official("First three digits of MD5 hash are 923.", THREAD),
    official("First digit of solution only MD5 hash is 0.", THREAD),
    official("First digit of TOMI field only MD5 hash is 6.", THREAD),
    official(
      "Hint 1 (after 24 hours): Found the idea for this block in a related Wikipedia article.",
      THREAD,
    ),
    official("Hint 2 (after 48 hours): Relevant article is on number 9.", THREAD),
  ],
  solvedAt: "2019-05-20 14:01:29",
  solveTime: 313_823,
  transactions: [
    funding(
      "b876a070c9dc65105b08bf11c179e9083656670852e4a5a8ca9c787aaf90ceca",
      "2019-05-16 22:51:06",
      0.007,
    ),
    increase(
      "6f3e16265734581839c82d1660505f0dcd42f04a62c10f2c8bb7d754f966ec0f",
      "2019-05-18 04:15:44",
      0.007,
    ),
    claim(
      "551bb1bde6aa455f3457e8bf86e904b67af428adad36eea92c87232f423412eb",
      "2019-05-20 14:01:29",
      0.005,
    ),
    claim(
      "c09ac20686c7c43282676a91543576260c2f27cfb1992ff4ebcdf537c23024c0",
      "2019-05-20 14:14:29",
      0.00655264,
    ),
  ],
});
