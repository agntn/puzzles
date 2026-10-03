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

/** The block 52 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c6jvz5/7_mbtc_quizchain2_block_52/";

/** u/kimi_tousan's comment with the solution and the link to block 5. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/c6jvz5/comment/es9dmdh/";

/** Quizchain2 block 52: `bat bat bot bit bet but`, the block 5 answer with its first word twice. */
export const quizchain2Block52 = puzzle({
  id: "quizchain2/52",
  chain: "bitcoin",
  address: "16NN7TqmCqQU5u6SmxMfaw26776mGoVxSC",
  sourceUrl: THREAD,
  startedAt: "2019-06-28 14:42:25",
  status: Status.Solved,
  pubkey: compressed("038cb56380787c44d53ffd057ee300dc8c449e562fe13020c61b63f03899e3df49"),
  key: wif("KxwMgyXqiaWDsiJwxcTeHNCuFjGs2DyyujqCmXLqvcM8XFwXo5Bu")
    .entropy("21bfa780bcb57ccdab161cc156650fc2", source(THREAD, "MD5 of the six words"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Six words.", THREAD, undefined, {
      answer: answer(
        "As winner explained in comments, solution was bat bat bot bit bet but.",
        THREAD,
      ),
    }),
    official("Format: [solution]", THREAD, undefined, {
      answer: answer("Solution: bat bat bot bit bet but", PLAYER_COMMENT),
    }),
    official("FIrst three digits of MP5 hash are 21b.", THREAD),
  ],
  solvedAt: "2019-06-28 14:42:25",
  solveTime: 0,
  transactions: [
    funding(
      "649f2566b32f1db7783f8434c8a73c1e1f34a660c5b434f7b9419d6cf173c7e2",
      "2019-06-28 14:42:25",
      0.007,
    ),
    claim(
      "fd5872115e89537dcfaab7d84e0a790da3ffcafcb46839c446b65d8dc9798595",
      "2019-06-28 14:42:25",
      0.00665421,
    ),
  ],
});
