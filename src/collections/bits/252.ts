import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `bits/252`. */
export const bits252 = puzzle({
  id: "bits/252",
  chain: "bitcoin",
  address: "1CaTxB3YwmXZkDnTK4rRvq61SRqs48xmui",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("0316bbf51b1574f580cd5ec84fe2371b4fd5644637b713f3a795474a1be794001c"),
  key: bits(252),
  prize: 0.252,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.252,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.252,
    ),
  ],
});
