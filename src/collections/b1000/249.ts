import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/249`. */
export const b1000Puzzle249 = bitcoinPuzzle({
  id: "b1000/249",
  address: p2pkh("1Bun4VzuBJ7SUoQn97dinVfDyWAS336Ldg", "77ac8098d4726a592aed489e3880c23cfaf719ae"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("02d1d5728abc050fc1c5fefc276616e50573139f89fdd01ac4ce2e52a19f945f8c"),
  key: bits(249),
  prize: 0.249,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.249,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.249,
    ),
  ],
});
