import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/173`. */
export const b1000Puzzle173 = bitcoinPuzzle({
  id: "b1000/173",
  address: p2pkh("1Mkodin3C3drVaV9JNk1o3i4n4gVGe9GVx", "e3ab5452f79c3ba677d230621f865667114ace03"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("0233d5bd5790203edab5c63839bee1765735c35254ec24f3073f65d99e1dabf90e"),
  key: bits(173),
  prize: 0.173,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.173,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.173,
    ),
  ],
});
