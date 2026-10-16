import { puzzle, Status } from "../../core/puzzle.ts";
import {
  answer,
  assets,
  claim,
  digest,
  fact,
  funding,
  official,
  party,
  type Answer,
} from "../../core/parts.ts";

/** The puzzle page, riddles and rules in one immutable transaction. */
const PAGE = "https://arweave.net/byT7l6tkFq8mzqshwmju8fVi1rp8H9mYanlxzsJ7RjQ";

/** ZorenX's write-up, which answers every riddle on the page. */
const WRITEUP = "https://zorenx.medium.com/arweave-puzzle-series-puzzle-01-solved-59aa19a0ea2f";

/**
 * One riddle's answer as the write-up prints it.
 *
 * @param {string} text - The answer, separators and all.
 * @returns {Answer} The answer, dated the day the write-up went up.
 */
function solved(text: string): Answer {
  return answer(text, WRITEUP, { date: "2020-06-09" });
}

/** Puzzle `weave/1`. */
export const weave1 = puzzle({
  id: "weave/1",
  chain: "arweave",
  address: "PbdTDYikdddWfNFlDt2aZokALXKe1mJVSC9TALUBNv8",
  sourceUrl: "https://arweave.net/byT7l6tkFq8mzqshwmju8fVi1rp8H9mYanlxzsJ7RjQ#instructions",
  startedAt: "2019-05-22 10:27:23",
  status: Status.Claimed,
  prize: 1000,
  solvedAt: "2019-05-23 19:53:50",
  solveTime: 120387,
  transactions: [
    funding("Yd0DrtrEzTg3K9HCxQY5fKgnng4S9ShH2WYmObFTLmo", "2019-05-22 10:27:23", 500),
    funding("KZac9xX660vJQmymsawId_pdM-oJjBYIlCSVE__Vq7w", "2019-05-23 15:13:40", 500),
    claim("BYZEa-jS5pfY-dakErCemga4fkM-mjBDEONW0IzcYAs", "2019-05-23 19:53:50", 999.99978588),
  ],
  solver: party("pogo", {
    key: "pogo",
    about:
      "Handle credited with the first two Arweave puzzles, each solved within two days of going up.",
    facts: [
      fact(
        "ZorenX's write-up of Puzzle 01 names pogo as the solver: a row of mini riddles typed into the page in the exact format it wanted.",
        WRITEUP,
      ),
    ],
  }),
  hints: [
    official(
      "When an answer consists of more than one number, write them in ascending order.",
      PAGE,
    ),
    official(
      "Sam and Kyle messed up with their wallet keys and they are only left with a tiny amount of AR. Sam says: -If I give you 1 AR, we'll have the same amount, but if you give me 1 AR, I'll have twice your amount. How much AR does Kyle have and how much AR does Sam have? _   _",
      PAGE,
      undefined,
      { answer: solved("5 , 7") },
    ),
    official(
      "A countdown device starts at 99:00. Each time the minutes are the same as the seconds or each time the whole display is a palindrome, the device beeps. What does the device display at 99th beep? _ _ _ _ _",
      PAGE,
      undefined,
      { answer: solved("10:01") },
    ),
    official(
      "A child was visiting a monastery. He was inquiring about the age of the monks and the abbot gave him the following answer: -To find the age of the youngest, take three times his age in three years and subtract three times his age three years ago. To find the age of the oldest, multiply the age of the youngest by five. _ _   _ _",
      PAGE,
      undefined,
      { answer: solved("18 , 90") },
    ),
    official("It is dead... Though it was never alive. _ _ _ _   _ _ _", PAGE, undefined, {
      answer: solved("Dead Sea"),
    }),
    official(
      "Josh was playing chess by correspondence. The letter with the last move got chewed by his dog. However, he managed to find pieces of paper containing 9, B and p. What was the move? _ _ _",
      PAGE,
      undefined,
      { answer: solved("Bd6") },
    ),
    official("37.334-122.011 = _ _ _ _ _", PAGE, undefined, { answer: solved("Apple") }),
    official(
      "Change the position of as few logos as possible to get the configuration from the right. _ _ _",
      PAGE,
      undefined,
      { answer: solved("039") },
    ),
  ],
  assets: assets({
    hints: ["1/logos.png"],
    digests: [
      digest(
        "1/logos.png",
        "21d4ab246e0065f39fe75f5e742c2fe8b225aaa4ea1416c3e58426bcb2741281",
        30707,
      ),
    ],
  }),
});
