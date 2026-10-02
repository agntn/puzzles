import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/188`. */
export const b1000Puzzle188 = puzzle({
  id: "b1000/188",
  chain: "bitcoin",
  address: "1DyWSY1dA3wyjo4eMuQCPfrm3dV96xDDSU",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("039705ff013b8514ee6eded8af52879598d19306f3e252f153dbfa02baa06d7dde"),
  key: bits(188),
  prize: 0.188,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.188,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.188,
    ),
  ],
});
