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

/** The block 29 thread, with the question, the funding txid, the hints and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/bwya8s/7_mbtc_quizchain2_block_29/";

/** Quizchain2 block 29: `Key`, riddle 4 of Symphosius, with his name and number in the TOMI field. */
export const quizchain2Block29 = puzzle({
  id: "quizchain2/29",
  chain: "bitcoin",
  address: "19UP4Fb7zcZ5JXnrGwPkuTGr6msZEJfbRa",
  sourceUrl: THREAD,
  startedAt: "2019-06-04 23:38:19",
  status: Status.Solved,
  pubkey: compressed("03a30a845216745ca831d8381a71b9f71214d2aeb3813d2ced593a93dd93d2c47c"),
  key: wif("L3HmHhyYCaxULQipVqy631Mw1h1xCUzJJ6CKhGYAeZhzbkQe2dAV")
    .entropy(
      "72f81ac9956b8d2a8874f0b06a4dc9ff",
      source(THREAD, "MD5 of the word, TOMI, a name and a number"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Great deeds", THREAD, undefined, {
      answer: answer('Solution for this classic riddle and for this block is "Key".', THREAD),
    }),
    official(
      'Format: [solution] TOMI [TOMI]. Solution is one word, with first letter only capital, like "Solution".',
      THREAD,
      undefined,
      {
        answer: answer("Update: As noted in comments, correct name is Symphosius.", THREAD),
      },
    ),
    official("First three digits of MD5 hash are 72f", THREAD),
    official("First digit of solution only MD5 hash is 8.", THREAD),
    official("First digit of TOMI only MD5 hash is c.", THREAD),
    official("Hint: with little", THREAD, undefined, {
      answer: answer(
        "This was a classic, number 4 in a collection of 100 riddles by Symphonius.",
        THREAD,
      ),
    }),
    official("TOMI field format is [name] [number]", THREAD, undefined, {
      answer: answer(
        "The TOMI field was the name of the author (Symphonius) and the number 4 since this is the number of this riddle in his collection.",
        THREAD,
      ),
    }),
  ],
  solvedAt: "2019-06-05 04:50:56",
  solveTime: 18_757,
  transactions: [
    funding(
      "2fe442ae6de1aa8b349f3bcc5fc2c7433a9e16fb0551430c078f84536c3a6f21",
      "2019-06-04 23:38:19",
      0.007,
    ),
    claim(
      "eb82d524bae0bf914ee66b8b8fb09a226b02b66e1d378bec9fbf3e9e87f88b4f",
      "2019-06-05 04:50:56",
      0.00699427,
    ),
  ],
});
