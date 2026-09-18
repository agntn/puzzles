import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/237`. */
export const b1000Puzzle237 = bitcoinPuzzle({
  id: "b1000/237",
  address: p2pkh("194bRtNQVRq4xi26UJZYTHexvLXijpzp3e", "586efe7cb41fc58c651225492e5c706a3af15d35"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("0288bc8b2d55ebc48d906478e7c37a78899632543dce63e6a9330a0a0c933e2095"),
  key: bits(237),
  prize: 0.237,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.237,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.237,
    ),
  ],
});
