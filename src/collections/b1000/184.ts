import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/184`. */
export const b1000Puzzle184 = bitcoinPuzzle({
  id: "b1000/184",
  address: p2pkh("14J1fXY2E3fbxjp1zpfqRhk5BNQ4pb97Rs", "242000d101c4c5b143c63f12ae08caa81d837c28"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("0377059f597c2e14d648807db27c8540f7cdd7e176c5baf979dcc00f251bdec6aa"),
  key: bits(184),
  prize: 0.184,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.184,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.184,
    ),
  ],
});
