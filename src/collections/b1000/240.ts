import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/240`. */
export const b1000Puzzle240 = bitcoinPuzzle({
  id: "b1000/240",
  address: p2pkh("1C8Hw6T5jypz92cNFr9Lkx4Xmr4DtP7zGA", "7a0a6e15efc2350d3dd45b88d855062a810ca619"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("03d569cafd2c67ce649d9b3484ae8cd392ad7019f0b7963fac095912d545070466"),
  key: bits(240),
  prize: 0.24,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.24,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.24,
    ),
  ],
});
