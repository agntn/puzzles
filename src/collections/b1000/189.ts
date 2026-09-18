import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/189`. */
export const b1000Puzzle189 = bitcoinPuzzle({
  id: "b1000/189",
  address: p2pkh("1PiLrDyeXtncnsvcVAGGcNnpzQVRCG3fwS", "f92463f967ffc9cea3e1ef846ff106b591e38e68"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("027a9e387d83df7847566373ef601f2b6dd9adbaf3fde5582199ed71f4b8ca9e08"),
  key: bits(189),
  prize: 0.189,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.189,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.189,
    ),
  ],
});
