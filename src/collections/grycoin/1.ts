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

/** The block 1 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/civj2n/7_mbtc_grycoin_chain_block_1/";

/** u/LiaVl's comment with the solution. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/civj2n/comment/ev9nhlc/";

/** The author's reply of July 28, 2019 about what the block hints at. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/Grycoin/comments/civj2n/comment/evaigpj/";

/** Grycoin chain block 1: `Still 21st Century`, claimed before the post went up. */
export const grycoinBlock1 = puzzle({
  id: "grycoin/1",
  chain: "bitcoin",
  address: "18EpYz5qB3XoxZWouJF3KdEp3E2nfv9FgP",
  sourceUrl: THREAD,
  startedAt: "2019-07-28 00:35:31",
  status: Status.Solved,
  pubkey: compressed("0358a499b712f0e7739fc53e82c84b87cb946298c9fd1fb5649906fa90f27e2ba9"),
  key: wif("L1K8wVaq5WYH184dcCBeHZEe3cQYkWnJz778LW2NeYq3QCtGsRyt")
    .entropy("4c414876be9043da4538386be9a03df6", source(THREAD, "MD5 of the solution"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: When is this?", THREAD, undefined, {
      answer: answer(
        'Update: As noted by winner below, solution to this block was "Still 21st Century".',
        THREAD,
        { date: "2019-07-28" },
      ),
    }),
    official("Format: [solution]", THREAD, undefined, {
      answer: answer("Still 21st Century", PLAYER_COMMENT, { date: "2019-07-28" }),
    }),
    official("First three digits of MD5 hash are 4c4.", THREAD),
    official(
      "But when I started up again, the first thing I wrote in my Twitter feed is the question for this block 1 of the Grycoin chain.",
      THREAD,
    ),
    official(
      "There may be a hint in this block for some of the unsolved quizchain big blocks.",
      THREAD,
    ),
    official(
      "It is for 77, but you will not see it if you let a script solve the block.",
      AUTHOR_COMMENT,
    ),
    official("And no, block 21 is not a hint for the format.", AUTHOR_COMMENT),
  ],
  solvedAt: "2019-07-28 01:31:44",
  solveTime: 3373,
  transactions: [
    funding(
      "75af636c49ba8127d02d79a36576e33bf248ceeb5bfd2bb04e2c0c6f4f4d493a",
      "2019-07-28 00:35:31",
      0.007,
    ),
    claim(
      "9509345e67024aff45b6e71988707fa86543e022a101bf46c2a61a680e2b315f",
      "2019-07-28 01:31:44",
      0.00691955,
    ),
  ],
});
