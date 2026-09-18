import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/190`. */
export const b1000Puzzle190 = bitcoinPuzzle({
  id: "b1000/190",
  address: p2pkh("1HUoYzoEn2a4WxKvnYYbnR9GKrVqAfq7oY", "b4c41a566543c9133f45361d6df0895319113538"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("03eb37cc02df3bd83f67e581116b2e08b1b4f27354a21d6345fe17484f4ba2ab8a"),
  key: bits(190),
  prize: 0.19,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.19,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.19,
    ),
  ],
});
