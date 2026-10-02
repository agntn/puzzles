import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/186`. */
export const b1000Puzzle186 = puzzle({
  id: "b1000/186",
  chain: "bitcoin",
  address: "1BJXBDt4e1uaorXPototucUGNRme57nAqt",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("03ab1c8c3d6b773758c2a765dd33fa0b9804c55754f9a9278a158a2d02a6edd1a6"),
  key: bits(186),
  prize: 0.186,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.186,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.186,
    ),
  ],
});
