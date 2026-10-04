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

/** The block 70 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/cds16v/7_mbtc_quizchain2_block_70/";

/** u/Randomiser's comment with the solution and the Wattpad chapter it came from. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/cds16v/comment/etw0pbd/";

/** Quizchain2 block 70: `Victor/Victoria`, the film from the Cariga Bright chapter, slash included. */
export const quizchain2Block70 = puzzle({
  id: "quizchain2/70",
  chain: "bitcoin",
  address: "19PShGAWvbs3LCvhhBUZFt2czPzEdQ17iX",
  sourceUrl: THREAD,
  startedAt: "2019-07-15 23:25:30",
  status: Status.Solved,
  pubkey: compressed("03b0b2f18d77e10a327b3613c9f144b5e53ef309cfee124e9e0e36466a68645147"),
  key: wif("Kwc5gTsJczZZY8m9r7Myp9hhV4KF9gEgesbq2wZyjJDShae8ubck")
    .entropy("71af184458431f453c6b660c79b6afe7", source(THREAD, "MD5 of the film title"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: ia", THREAD, undefined, {
      answer: answer(
        'Solution was "Victor/Victoria", a film about a female pretending to be a male pretending to be a female, with lots of comedy effects from that setup.',
        THREAD,
      ),
    }),
    official("Format: [solution]", THREAD, undefined, {
      answer: answer("The answer was: Victor/Victoria", PLAYER_COMMENT),
    }),
    official("FIrst three digits of MD5 hash are 71a.", THREAD),
  ],
  solvedAt: "2019-07-16 04:00:45",
  solveTime: 16515,
  transactions: [
    funding(
      "a87465e396ac4502402d063269c2c518ab094bea07d26a8fe74c15b349fd4ad6",
      "2019-07-15 23:25:30",
      0.007,
    ),
    claim(
      "ab3e99f45499786c2910a78ee42dd6824fada16f19e38005e613800eceedb9ed",
      "2019-07-16 04:00:45",
      0.0068537,
    ),
  ],
});
