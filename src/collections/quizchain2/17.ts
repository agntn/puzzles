import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The block 17 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/bsnke3/7_mbtc_quizchain2_block_17/";

/** u/mooncritic's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/bsnke3/comment/eooiqyb/";

/** Quizchain2 block 17: `LV TOMI Mona Lisa`, for 8 mBTC, the cross sum of 17. */
export const quizchain2Block17 = puzzle({
  id: "quizchain2/17",
  chain: "bitcoin",
  address: "19XZ9YAN4GHdktoWU6W6mZKLQZUoUFeFfb",
  sourceUrl: THREAD,
  startedAt: "2019-05-24 12:23:12",
  status: Status.Solved,
  pubkey: compressed("0314c0b41514a2c034c719c45eb0adde55ea1e72d3859868ddb5b9a8ccb5b3099e"),
  key: wif("KzY3p5xmbMZ1KCoPV2EHXGfrTQuBoxbomPSrk7znSFHr2abY4b8n")
    .entropy(
      "885f0a95963d544208ebb0ac6f2a8b7a",
      source(THREAD, "MD5 of the letters, TOMI and two words"),
    )
    .derived(),
  prize: 0.008,
  hints: [
    official("Question: 500 years in the right eye", THREAD, undefined, {
      answer: answer(
        "Solved at sight, solution was LV, TOMI field Mona Lisa. It took about 500 years for someone to notice that Leonardo signed his work there...",
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer('Solved! "LV TOMI Mona Lisa"', PLAYER_COMMENT),
    }),
    official("FIrst three digits of MD5 hash are 885.", THREAD),
    official("First digit of solution only MD5 hash is a.", THREAD),
    official("First digit of TOMI only MD5 hash is f.", THREAD),
  ],
  solvedAt: "2019-05-24 23:05:03",
  solveTime: 38_511,
  transactions: [
    funding(
      "64eb4eae0b4d74875a580f3b7f192ef4cecb1ef2c1e679721589c5cee2b85bd8",
      "2019-05-24 12:23:12",
      0.008,
    ),
    claim(
      "d903c67367df9e9741f701907143bfce92dd46a7b10eca889879baf35d68639f",
      "2019-05-24 23:05:03",
      0.00753203,
    ),
  ],
});
