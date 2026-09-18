import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/195`. */
export const b1000Puzzle195 = bitcoinPuzzle({
  id: "b1000/195",
  address: p2pkh("16q15tpaHQFUENUmRPLgiidCMWLcDpVEgs", "3fecaa5f1295e3374ef2b04a365523cfcb56305a"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("029cfb4b5b2830188161b359fc1fb7ef3023b3212889ee8565a7989de774af192d"),
  key: bits(195),
  prize: 0.195,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.195,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.195,
    ),
  ],
});
