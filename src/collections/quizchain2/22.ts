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

/** The block 22 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD =
  "https://www.reddit.com/r/Grycoin/comments/busqnm/prize_claimed_before_posting_quizchain2_block_22/";

/** Quizchain2 block 22: `Bitcoin white paper`, claimed before the post went up. */
export const quizchain2Block22 = puzzle({
  id: "quizchain2/22",
  chain: "bitcoin",
  address: "1CU5ZeSC65qXpEztyHAFagz7PfHaio7a59",
  sourceUrl: THREAD,
  startedAt: "2019-05-30 03:16:17",
  status: Status.Solved,
  pubkey: compressed("03a38ae1ebff619d8232915bc1d86c3c826452de548e6d0a6836a50c4450c51fbb"),
  key: wif("KzjcAZSJijpZCKt51Hs8ah3Jowubx47LDrExCgr93mZNctWNAs88")
    .entropy("aa0e948775fa99561a0efd2f66b5500b", source(THREAD, "MD5 of the three words"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: https://en.m.wikipedia.org/wiki/Ninety-five_Theses", THREAD, undefined, {
      answer: answer(
        'The solution for this was "Bitcoin white paper". I used the fact that Luther posted the 95 theses on October 31, which is the same date as the white paper.',
        THREAD,
      ),
    }),
    official("Format: [solution]", THREAD),
    official(
      "In an interesting coincidence, the first three digits of the MD5 hash for this block are aa0.",
      THREAD,
    ),
  ],
  solvedAt: "2019-05-30 08:35:57",
  solveTime: 19_180,
  transactions: [
    funding(
      "21257d3d61b08473ebb6f3faedc9a9dd8d52a34403ba417da0c3093bdf4f4aa4",
      "2019-05-30 03:16:17",
      0.007,
    ),
    claim(
      "89d5cd5a6677b1252cdc7635c81ca9f5b2d8ff210da4f38eec96ae4114905d8b",
      "2019-05-30 08:35:57",
      0.00668474,
    ),
  ],
});
