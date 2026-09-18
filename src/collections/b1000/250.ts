import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/250`. */
export const b1000Puzzle250 = bitcoinPuzzle({
  id: "b1000/250",
  address: p2pkh("1Ruu3JwvGeSmhQV9GzWAnyLCz6g3evmTY", "04b623b48cc42741d0c9ec3b1fa297664bcec49b"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("0230465312b31af6b26c64d58ebc8a890c41f52f57a5c0eb305d83b0351c4bf968"),
  key: bits(250),
  prize: 0.25,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.25,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.25,
    ),
  ],
});
