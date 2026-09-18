import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/253`. */
export const b1000Puzzle253 = bitcoinPuzzle({
  id: "b1000/253",
  address: p2pkh("1JqRqUPHHcQu2yrr8JZzxSYDx2jbZxEqFj", "c3a2d618736baf0d5df7d81d5b8235cf8a266448"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("0322ae607614dedc7261f4214dada55f1a0f11926174c3bf1689351c1783f3da48"),
  key: bits(253),
  prize: 0.253,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.253,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.253,
    ),
  ],
});
