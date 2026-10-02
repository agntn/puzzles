import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The block 23 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/bustcu/7_mbtc_quizchain2_block_23/";

/** Quizchain2 block 23: `P`, the letter `PG` lacks, with `Pretty Good Privacy` in the TOMI field. */
export const quizchain2Block23 = puzzle({
  id: "quizchain2/23",
  chain: "bitcoin",
  address: "14bavWYFj3GDbXG3KJihTUuWaZu6oce4zT",
  sourceUrl: THREAD,
  startedAt: "2019-05-30 12:43:29",
  status: Status.Solved,
  pubkey: compressed("03ed49b3afa2b4bd7762ee3855d0cb25d8a9ac086ca86353e984ab164dc68cfa19"),
  key: wif("L1VFUsRTgdYZnFGdX14RNb9e8AoWHgmRTsn51b3DYhMjLvpvhn4X")
    .entropy(
      "5933d9f1db6fbd064cf19004cc8e62b3",
      source(THREAD, "MD5 of the letter, TOMI and three words"),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: PG", THREAD, undefined, {
      answer: answer(
        'Solution was "P" and TOMI field was "Pretty Good Privacy". I wanted to use this idea because the link to Bitcoin\'s cypherpunk roots.',
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD),
    official("First 3 digits of MD5 hash are 593.", THREAD),
    official("First digit of solution only MD5 hash is 4.", THREAD),
    official("First digit of TOMI field only MD5 hash is 5.", THREAD),
  ],
  solvedAt: "2019-05-30 15:55:40",
  solveTime: 11_531,
  transactions: [
    funding(
      "f3f49ed66c0041cad2cde7cab0132094811b6c1d1c8e3dd189b59fc110dd98c0",
      "2019-05-30 12:43:29",
      0.007,
    ),
    claim(
      "9bd5338638e98e9f25acf41f1eb36e8ffc0b1512927bbfe6da8cfb6f013fa8d4",
      "2019-05-30 15:55:40",
      0.00665811,
    ),
  ],
});
