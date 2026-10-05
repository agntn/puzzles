import { claim, compressed, funding, official } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The Stage One thread, with the question, the funding txid, three hints and the format update. */
const THREAD =
  "https://www.reddit.com/r/Grycoin/comments/ca6jxv/77_mbtc_quizchain2_block_77_stage_one/";

/** The author's reply of July 15, 2019 with the first hash digits, as a prize for the first run's block 77. */
const HASH_DIGITS = "https://www.reddit.com/r/Grycoin/comments/ca6jxv/comment/etto4a5/";

/** Quizchain2 block 77, Stage One: Hal Finney's Bitcointalk post as a Satoshi puzzle. Claimed, and the solver kept the tricky bits. */
export const quizchain2Block77 = puzzle({
  id: "quizchain2/77",
  chain: "bitcoin",
  address: "19TbyN5KCg1Lg7qHwezifsLVcdSa2Rj5KN",
  sourceUrl: THREAD,
  startedAt: "2019-07-07 09:16:50",
  status: Status.Claimed,
  pubkey: compressed("02e77b75850c735f8efb1afe8677f007e6d7e82b07bacbd37a0b37712316cd06e2"),
  prize: 0.077,
  hints: [
    official("Question: https://bitcointalk.org/index.php?topic=155054.0", THREAD),
    official("Format: [solution]", THREAD),
    official("I do disclose that this one has no TOMI field, but that is all.", THREAD),
    official(
      'Hint 1: I already knew that "Satoshi" was chosen as an anagram of "Thomas" when I solved this. That helps with the solution, though not very much.',
      THREAD,
    ),
    official(
      "Hint two: Satoshi writes \"Today, Satoshi's true identity has become a mystery. But at the time, I thought I was dealing with a young man of Japanese ancestry who was very smart and sincere. I've had the good fortune to know many brilliant people over the course of my life, so I recognize the signs.\" This is Satoshi's hint right in the post on how to decode it.",
      THREAD,
    ),
    official(
      "Hint 3 (last hint): When solving the genesis block puzzle, I had the advantage of having solved this one already, so I knew what to look for. Was much easier to recognize the signs in the genesis block that way.",
      THREAD,
    ),
    official(
      "Okay. I think solving 77 deserves a celebration of sorts. Here you are: 9dd (copypasted).",
      HASH_DIGITS,
    ),
    official(
      "Update: Now the solution to Satoshi's puzzle is published the remaining resistance to solving the block comes from having to find the format of the solution. The format was used in one previous block. The block I will publish tomorrow will give a further clue on what previous block that was.",
      THREAD,
    ),
  ],
  solvedAt: "2019-08-03 14:09:57",
  solveTime: 2_350_387,
  transactions: [
    funding(
      "ccf5ad645f069dfe263e3df63c906ed6ce449813b968c12c0f862b475014b4bb",
      "2019-07-07 09:16:50",
      0.077,
    ),
    claim(
      "f9344de3198c70caa8f55a7121c345554c8811f4fae868259503a1655fb355f8",
      "2019-08-03 14:09:57",
      0.07689594,
    ),
  ],
});
