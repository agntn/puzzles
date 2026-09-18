import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/170`. */
export const b1000Puzzle170 = bitcoinPuzzle({
  id: "b1000/170",
  address: p2pkh("1EW9W5sGdxVDxAtjRbCjgkZNtPH8ZzikeP", "941ccb7383109b47b841044c9f865785676b0918"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("03e56c48f1bc4a6d06a2e0a4ad53c7674403dbfdaaeee3ecc86aff294b04997d61"),
  key: bits(170),
  prize: 0.17,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.17,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.17,
    ),
  ],
});
