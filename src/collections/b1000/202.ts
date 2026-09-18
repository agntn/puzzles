import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/202`. */
export const b1000Puzzle202 = bitcoinPuzzle({
  id: "b1000/202",
  address: p2pkh("19Ho5YB6y8qRCdUMxWpXqrm8N4AKAq7ZWS", "5aee20366a5523246e1c43dc48462878b0d4806e"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("02669d985185d1894541f6ab7ea7fd57dace5bf97f2c73736b205ab07a5685354b"),
  key: bits(202),
  prize: 0.202,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.202,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.202,
    ),
  ],
});
