import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/183`. */
export const b1000Puzzle183 = bitcoinPuzzle({
  id: "b1000/183",
  address: p2pkh("12E2HWQVHzuGKAQVvPUkHWwibAJfnmcHW1", "0d6e9b09e523e71ad7b9873dadee0d0bc788033c"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("036d249dae9d1f3afe5c85ec6f34561a2373d6c0b6cfa8ca1b4ae00d1937e7a59b"),
  key: bits(183),
  prize: 0.183,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.183,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.183,
    ),
  ],
});
