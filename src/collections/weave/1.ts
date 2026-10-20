import { puzzle, Status } from "../../core/puzzle.ts";
import {
  answer,
  assets,
  claim,
  digest,
  fact,
  funding,
  keyfile,
  official,
  party,
  PartyKind,
  profile,
  type Answer,
  type HintOptions,
} from "../../core/parts.ts";

/** The puzzle page, riddles and rules in one immutable transaction. */
const PAGE = "https://arweave.net/byT7l6tkFq8mzqshwmju8fVi1rp8H9mYanlxzsJ7RjQ";

/** Block time of the page transaction, the moment the riddles went public. */
const PUBLISHED = "2019-05-23 15:49:53";

/** pogo's reply under the launch tweet, with the whole solution in one line. */
const SOLVED = "https://x.com/PogoB/status/1131654631250178049";

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

/**
 * Dates a page hint and attaches its answer, when it has one.
 *
 * @param {string} [text] - The answer as the write-up prints it.
 * @returns {HintOptions} The page's publication time, plus the answer.
 */
function dated(text?: string): HintOptions {
  return text === undefined ? { date: PUBLISHED } : { date: PUBLISHED, answer: solved(text) };
}

/** The prize wallet's keyfile, sealed in the page's `var msg`. */
const KEYFILE =
  "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";

/** The write-up's answers as the page takes them: ten boxes joined, Dead Sea without its space. */
const ANSWER = "5710:011890DeadSeaBd6Apple039";

/** Puzzle `weave/1`. */
export const weave1 = puzzle({
  id: "weave/1",
  chain: "arweave",
  address: "PbdTDYikdddWfNFlDt2aZokALXKe1mJVSC9TALUBNv8",
  sourceUrl: "https://arweave.net/byT7l6tkFq8mzqshwmju8fVi1rp8H9mYanlxzsJ7RjQ#instructions",
  startedAt: "2019-05-22 10:27:23",
  status: Status.Claimed,
  key: keyfile(KEYFILE, { passphrase: ANSWER }),
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
    kind: PartyKind.Person,
    aliases: ["PogoB"],
    about:
      "Twitter user who solved the first two Arweave puzzles, each within two days of going up, and posted the Weave 1 answer under its launch tweet.",
    profiles: [profile("twitter", "https://twitter.com/PogoB")],
    facts: [
      fact(
        'Replied to @ArweaveP twenty minutes after the claim: Solved! The solution was "5 7 10:01 18 90 Dead Sea Bd6 Apple 039".',
        SOLVED,
        { date: "2019-05-23" },
      ),
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
      undefined,
      dated(),
    ),
    official(
      "Sam and Kyle messed up with their wallet keys and they are only left with a tiny amount of AR. Sam says: -If I give you 1 AR, we'll have the same amount, but if you give me 1 AR, I'll have twice your amount. How much AR does Kyle have and how much AR does Sam have? _   _",
      PAGE,
      undefined,
      dated("5 , 7"),
    ),
    official(
      "A countdown device starts at 99:00. Each time the minutes are the same as the seconds or each time the whole display is a palindrome, the device beeps. What does the device display at 99th beep? _ _ _ _ _",
      PAGE,
      undefined,
      dated("10:01"),
    ),
    official(
      "A child was visiting a monastery. He was inquiring about the age of the monks and the abbot gave him the following answer: -To find the age of the youngest, take three times his age in three years and subtract three times his age three years ago. To find the age of the oldest, multiply the age of the youngest by five. _ _   _ _",
      PAGE,
      undefined,
      dated("18 , 90"),
    ),
    official(
      "It is dead... Though it was never alive. _ _ _ _   _ _ _",
      PAGE,
      undefined,
      dated("Dead Sea"),
    ),
    official(
      "Josh was playing chess by correspondence. The letter with the last move got chewed by his dog. However, he managed to find pieces of paper containing 9, B and p. What was the move? _ _ _",
      PAGE,
      undefined,
      dated("Bd6"),
    ),
    official("37.334-122.011 = _ _ _ _ _", PAGE, undefined, dated("Apple")),
    official(
      "Change the position of as few logos as possible to get the configuration from the right. _ _ _",
      PAGE,
      undefined,
      dated("039"),
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
