import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The block 19 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/btjb8j/7_mbtc_quizchain2_block_19/";

/** u/mooncritic's comment with the solution. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/btjb8j/comment/eoyvf87/";

/** Quizchain2 block 19: `Cypherpunks`, with no TOMI field. */
export const quizchain2Block19 = puzzle({
  id: "quizchain2/19",
  chain: "bitcoin",
  address: "19HcFFX5iyW5y7FW8qQvsbsJjh6EnyFH7s",
  sourceUrl: THREAD,
  startedAt: "2019-05-27 03:54:16",
  status: Status.Solved,
  pubkey: compressed("02558d14916fcc01aec0f71509dac8f5876152c870f7fdf6d67c4977320e621217"),
  key: wif("Kz96DNRR6XXACtfnDCoj8trAt69HcK9NGJy8F4pFeq6BVrPsP79P")
    .entropy("1470f0bd9262f71b15261cebc7d97aad", source(THREAD, "MD5 of the one word"))
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: Before Bitcoin", THREAD, undefined, {
      answer: answer(
        "Solution was Cypherpunks, since that is the mindset where Bitcoin comes from.",
        THREAD,
      ),
    }),
    official("Format: [solution]", THREAD, undefined, {
      answer: answer('The solution is "Cypherpunks"! :3', PLAYER_COMMENT),
    }),
    official("FIrst three digits of MD5 hash are 147.", THREAD),
  ],
  solvedAt: "2019-05-27 08:53:31",
  solveTime: 17_955,
  transactions: [
    funding(
      "dd61d9a8d06c4303008372726bf61fdc624a759e3b3f8e6bd2b167e82594e14e",
      "2019-05-27 03:54:16",
      0.007,
    ),
    claim(
      "82677fa3fb0f78cac1d92ff2824cfc372a6b2dc189841735ef508df2fe27dc5b",
      "2019-05-27 08:53:31",
      0.00659473,
    ),
  ],
});
