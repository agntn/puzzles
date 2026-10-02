import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The block 31 thread, with the question, the funding txid, the hint and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/bxuciq/7_mbtc_quizchain2_block_31/";

/** u/puzzleponky's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/bxuciq/comment/eqe7bby/";

/** Quizchain2 block 31: `black ink marks`, the seed of the Veronese riddle, with the riddle's name in the TOMI field. */
export const quizchain2Block31 = puzzle({
  id: "quizchain2/31",
  chain: "bitcoin",
  address: "1JNhEMuFua8KRE5UJL7dYfhkxA1fEV1zFn",
  sourceUrl: THREAD,
  startedAt: "2019-06-07 11:27:39",
  status: Status.Solved,
  pubkey: compressed("0302ec5a26f056318011b58ba8c537b2585e47b88a13f4e1c21acc459e0f554562"),
  key: wif("KzyvYuQadrXDubP5td6ez6MkjsrCam7g6mKqyhUi2jRMwYyrTYZb")
    .entropy(
      "ac74af06aee6e66bef1ff271ed9c289a",
      source(THREAD, "MD5 of the three words, TOMI and two words"),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: oxen", THREAD, undefined, {
      answer: answer(
        'Solution was "black ink marks" and TOMI field was "Veronese riddle".',
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer(
        'So complete solution is "black ink marks TOMI Veronese riddle"',
        PLAYER_COMMENT,
      ),
    }),
    official("First three digits of MD5 hash are ac7.", THREAD),
    official("First digit of solution only MD5 hash is e.", THREAD),
    official("FIrst digit of TOMI field only MD5 hash is b.", THREAD),
    official(
      "This is another famous classic riddle, not quite as old as the sphinx riddle or the lion story, but known for about 1000 years.",
      THREAD,
    ),
  ],
  solvedAt: "2019-06-08 13:15:12",
  solveTime: 92_853,
  transactions: [
    funding(
      "032ce0af6c0b689f448c232af18f002d205e78e2b1e764f3950bee84a55fa304",
      "2019-06-07 11:27:39",
      0.007,
    ),
    claim(
      "383920dd2c93034b34d3db4c6151977b53ae494fa3c0d8a71566b4302a6015f0",
      "2019-06-08 13:15:12",
      0.00683219,
    ),
  ],
});
