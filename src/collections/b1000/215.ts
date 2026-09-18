import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/215`. */
export const b1000Puzzle215 = bitcoinPuzzle({
  id: "b1000/215",
  address: p2pkh("15x3tRVyn9SRaxfbFUzqETmCJiz46Vs247", "3649ca67657d482484f49f8f5c8cdb5222c8700f"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("02dcab1861d56d3b6ca4d741f885c9f7b34d91b460f90b3dc1983acf701ca8092f"),
  key: bits(215),
  prize: 0.215,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.215,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.215,
    ),
  ],
});
