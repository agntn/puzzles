import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/171`. */
export const b1000Puzzle171 = bitcoinPuzzle({
  id: "b1000/171",
  address: p2pkh("17zzMMnj5h8StLhnrXpw8iBP21uujNC4Ap", "4cc856b74f1be643a3a0ac65f5399e018aed7ae5"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("021b6f7d2e3d33f99fa44985c68ae85827282c64701a2c663bd81e18a229a3562d"),
  key: bits(171),
  prize: 0.171,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.171,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.171,
    ),
  ],
});
