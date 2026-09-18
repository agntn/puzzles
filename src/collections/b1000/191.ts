import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/191`. */
export const b1000Puzzle191 = bitcoinPuzzle({
  id: "b1000/191",
  address: p2pkh("19vnME8b28SzJDuEFNShAG5JCR63V1zzV", "01b038f889ed602266f2c6647f657713e52d8cac"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("03bd9d14ad1d7d2c3d1f46b5f2c82142a5c0784ff4506c04ae0a99d9737e1630d1"),
  key: bits(191),
  prize: 0.191,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.191,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.191,
    ),
  ],
});
