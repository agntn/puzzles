import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/244`. */
export const b1000Puzzle244 = bitcoinPuzzle({
  id: "b1000/244",
  address: p2pkh("1KMHDrCGho2QuK59UNvfjuiPdDZSgRbneC", "c9481fd7d3d294113c5e53990d9451e32844c0ec"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("02eaa8294f7cba1ddf4a990032a2a6d9f07eef4309ab1a27a3446f591efe189314"),
  key: bits(244),
  prize: 0.244,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.244,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.244,
    ),
  ],
});
