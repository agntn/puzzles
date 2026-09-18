import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/203`. */
export const b1000Puzzle203 = bitcoinPuzzle({
  id: "b1000/203",
  address: p2pkh("1DVWn7PuRBmsdTBKiboBdSREHdAtSoN6BB", "89060378aec62c83cd6e20d92865cf9ca80549b1"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("034fd997afbe4608f743661ae417c5706b044d9d5532a51aef5f4cb244f5f5dce1"),
  key: bits(203),
  prize: 0.203,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.203,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.203,
    ),
  ],
});
