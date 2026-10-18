import { funding, official } from "../../core/parts.ts";
import { puzzle } from "../../core/puzzle.ts";

/** Part 1 of the second puzzle. */
const PART_1 = "https://www.youtube.com/watch?v=TRUUTryah70";

/** Part 2, three weeks after part 1. */
const PART_2 = "https://www.youtube.com/watch?v=U_0DtYHDPy0";

/** No video names the address: the wallet that funded puzzle 1 sent it the same 0.05 ETH. */
export const cryptoPuzzles2 = puzzle({
  id: "crypto-puzzles/2",
  chain: "ethereum",
  address: "0x1fa8Be9De5bBFE047C72dB8E8E3257128F7661ad",
  sourceUrl: PART_1,
  startedAt: "2018-08-06 06:08:41",
  prize: 0.05,
  hints: [
    official(
      "Do you have the intellience to solve the Crypto Puzzle? 0.05ETH is waiting for the best puzzler solver. Is it you?",
      PART_1,
      undefined,
      { date: "2018-08-06" },
    ),
    official(
      "The first puzzle was solved in hours, so our second is decidely trickier.  Are you smart enough?",
      PART_2,
      undefined,
      { date: "2018-08-27" },
    ),
  ],
  transactions: [
    funding(
      "0x8eb982ebfb492eb535724c1f9a68253bef31598712315b5ff3a11b5efa71bbdf",
      "2018-08-01 04:14:09",
      0.05,
    ),
  ],
});
