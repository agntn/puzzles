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

/** The block 75 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/cfs3ld/12_mbtc_quizchain2_block_75/";

/** u/reddeneer's comment with the solution and the Quizchain introduction it came from. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/cfs3ld/comment/euc45fy/";

/** Quizchain2 block 75: `reverse Turing test`, the purpose of the real big block, straight from the author's own FAQ. */
export const quizchain2Block75 = puzzle({
  id: "quizchain2/75",
  chain: "bitcoin",
  address: "15pmBkzmSyXg2KhYHMmauF3EjYNEvyiABS",
  sourceUrl: THREAD,
  startedAt: "2019-07-20 22:46:49",
  status: Status.Solved,
  pubkey: compressed("03b5bc1ca09a5cef50f2daf610b559096f4650e912211da6eb8217e76c9b5186d6"),
  key: wif("KyjdU7g9VHRwvZWe6337DPCeHZFpVojPEgHsTebH2GuZLnKvGqYf")
    .entropy("5090a11660cbe404ecda4b8f0b05ad2d", source(THREAD, "MD5 of three words"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.012,
  hints: [
    official("Question: The purpose of the real big block.", THREAD, undefined, {
      answer: answer('Solved at sight, solution was "reverse Turing test".', THREAD),
    }),
    official("Format: [solution]", THREAD, undefined, {
      answer: answer("reverse Turing test", PLAYER_COMMENT),
    }),
    official("First three digits of MD5 hash are 509 (copypasted).", THREAD),
  ],
  solvedAt: "2019-07-20 23:08:07",
  solveTime: 1278,
  transactions: [
    funding(
      "c52c46d2831e8372393af09f66541647b6d1bda80694d87886ed7bd6cc5298be",
      "2019-07-20 22:46:49",
      0.012,
    ),
    claim(
      "118d23d318477b06d546dfe620bef5e880bf797257f1316c19bd8961a2264fee",
      "2019-07-20 23:08:07",
      0.01183795,
    ),
  ],
});
