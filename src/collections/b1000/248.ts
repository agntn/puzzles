import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/248`. */
export const b1000Puzzle248 = bitcoinPuzzle({
  id: "b1000/248",
  address: p2pkh("18oqrdP6uBKsn57gvmWzLuKMAY4ShapiAU", "55a4cc2020c1769dce6c05e560bcff5db9f27f3a"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("031037fc1784819309a913864372322768fee8ba8c3d3bf0566936096dab4157db"),
  key: bits(248),
  prize: 0.248,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.248,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.248,
    ),
  ],
});
