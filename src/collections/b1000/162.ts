import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/162`. */
export const b1000Puzzle162 = bitcoinPuzzle({
  id: "b1000/162",
  address: p2pkh("17DTUTXUcUYEgrr5GhivxYei4Lrs1xMnS2", "442bd85a46d4acd7b082c1d731fb13c8474ffa6f"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("03294d33f5e7b98c885ff540fd3f747010999f640d8fdb021f5a13ef3d06c36a58"),
  key: bits(162),
  prize: 0.162,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.162,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.162,
    ),
  ],
});
