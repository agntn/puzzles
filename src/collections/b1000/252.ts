import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/252`. */
export const b1000Puzzle252 = bitcoinPuzzle({
  id: "b1000/252",
  address: p2pkh("1CaTxB3YwmXZkDnTK4rRvq61SRqs48xmui", "7efd9baf1d6e21bd5f920e7e9e468b5a45ec92c7"),
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
