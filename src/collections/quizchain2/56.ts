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

/** The block 56 thread, with the question, the funding txid, the hash digits, the hint and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c88x4w/7_mbtc_quizchain2_block_56/";

/** u/userm1010110's comment with the sentence, copied from the post. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/c88x4w/comment/esp6ny4/";

/** Quizchain2 block 56: the sentence with `unlucky` in Satoshi's 56th Bitcointalk post. */
export const quizchain2Block56 = puzzle({
  id: "quizchain2/56",
  chain: "bitcoin",
  address: "14tuS6dG5BXd1usDTUJduEDafFAuET74P5",
  sourceUrl: THREAD,
  startedAt: "2019-07-02 11:17:56",
  status: Status.Solved,
  pubkey: compressed("03a1ea1a601498f87a2e4623356412690bc589622568a011838ddab4750ecc23d4"),
  key: wif("L17Yo2Tz1HVJwrHeQj9tvruYffvna3pEZEGfJ6ToGEZpKbn66cAB")
    .entropy("b9f039524fd1a9043817541f429c573e", source(THREAD, "MD5 of the sentence"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: unlucky", THREAD, undefined, {
      answer: answer(
        'Method was using the post number 56 (number of this block) Hal as Satoshi on Bitcointalk and using the whole sentence the word "unlucky" appeared in as a solution, which works out to "Maybe you were just unlucky to have an exit node without reverse lookup."',
        THREAD,
      ),
    }),
    official("Format: [solution]", THREAD, undefined, {
      answer: answer(
        '"Maybe you were just unlucky to have an exit node without reverse lookup." exactly as Satoshi said in Bitcointalk forum in his own post number of 56, only first statement of it also. (I copy pasted it)',
        PLAYER_COMMENT,
      ),
    }),
    official("First three digits of MD5 hash are b9f.", THREAD),
    official("Hint 1: Something Hal Finney said.", THREAD),
  ],
  solvedAt: "2019-07-03 18:58:23",
  solveTime: 114_027,
  transactions: [
    funding(
      "f4bcd3b94827d049362e075d1122a9aeae4983a66debe92957b2c5069a2c4d68",
      "2019-07-02 11:17:56",
      0.007,
    ),
    claim(
      "c200e52970f155806c4ea432c9ea264428da25b10d2f639fb4a7bda5b08dcbcd",
      "2019-07-03 18:58:23",
      0.00674829,
    ),
  ],
});
