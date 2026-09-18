import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/221`. */
export const b1000Puzzle221 = bitcoinPuzzle({
  id: "b1000/221",
  address: p2pkh("1NxgWntAdMugSNFHEXYizYwk3UjxKPxcDF", "f0e280f15876be99ab63c8aaa4f934f777ed369b"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("028a874fe6f1ab00358d0b610d536fd67f049c98069eeb35585549250ef9fff4c5"),
  key: bits(221),
  prize: 0.221,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.221,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.221,
    ),
  ],
});
