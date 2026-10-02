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

/** The block 28 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/bwm5hb/7_mbtc_quizchain2_block_28/";

/** Quizchain2 block 28: `Running bitcoin`, Hal Finney's tweet, in his spelling. */
export const quizchain2Block28 = puzzle({
  id: "quizchain2/28",
  chain: "bitcoin",
  address: "18Z3A91W5TDT7cEBDkPWaVEy4tWPzuLVh3",
  sourceUrl: THREAD,
  startedAt: "2019-06-04 06:37:03",
  status: Status.Solved,
  pubkey: compressed("031db9d4dc1d1fba1966093c948e5987814464aa79e2cf3ff1957b3b224637d83f"),
  key: wif("KzGzhzaRpAfb2AzrtKtTkeTnAiLEkWj5dUbfY4krJkYZnJqRVnz4")
    .entropy(
      "31606856fd4a33fc03b9216fefc2f221",
      source(THREAD, "MD5 of the two words, TOMI and the given field"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Verb Noun", THREAD, undefined, {
      answer: answer('Solution was "Running bitcoin", the famous tweet by Hal Finney.', THREAD),
    }),
    official("Format: [solution] TOMI obvious at first sight", THREAD),
    official("First three digits of MD5 hash are 316.", THREAD),
  ],
  solvedAt: "2019-06-04 08:10:16",
  solveTime: 5_593,
  transactions: [
    funding(
      "35dc236f4c9668100f17aa952b4af42053637b1807a2dec7deb2b0617a41dbc1",
      "2019-06-04 06:37:03",
      0.007,
    ),
    claim(
      "f3f3f0698f68109f87d80352a95568d4553b2d96284584648e9b6b1feb777d3c",
      "2019-06-04 08:10:16",
      0.00659776,
    ),
  ],
});
