import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/180`. */
export const b1000Puzzle180 = bitcoinPuzzle({
  id: "b1000/180",
  address: p2pkh("1EkYsB1C7deWxiVUULeZpr42AdYWhv4PEX", "96d61f034c1d3db504e6c84e1d9b5e47b3bbb6ef"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("0329420514190479e81640f967e686e2d950e231edd021fc63a17193dac2969a3d"),
  key: bits(180),
  prize: 0.18,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.18,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.18,
    ),
  ],
});
