import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/177`. */
export const b1000Puzzle177 = bitcoinPuzzle({
  id: "b1000/177",
  address: p2pkh("163vG9mKmAsrvmq42MBDPjf9axZyEgBc9R", "3765ebcb90c64c4167674c8c2f35ad3d12245fb5"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("028ae59ec009a07fad636a066f72d567a1fe9a37492b40688c2edfe18de00f284c"),
  key: bits(177),
  prize: 0.177,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.177,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.177,
    ),
  ],
});
