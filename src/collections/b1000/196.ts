import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/196`. */
export const b1000Puzzle196 = bitcoinPuzzle({
  id: "b1000/196",
  address: p2pkh("1AH4d8Bss6eFyugZaN2qPXMBH69T946dSK", "65c2cfc6b38650c00242435f1b041a5fb1b733ee"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("02e56e407ea984475f21ee82e96822c541967dae2a68e85ef883ec46c7646d6f67"),
  key: bits(196),
  prize: 0.196,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.196,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.196,
    ),
  ],
});
