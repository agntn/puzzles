import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/254`. */
export const b1000Puzzle254 = bitcoinPuzzle({
  id: "b1000/254",
  address: p2pkh("1NKkjFvXmovmjwgUujw655n3BbEvnncyza", "e9e6a1ad0ddaf3c372e2e1eae83c8cf9f9163b3a"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("0255d81444d53e97bf282ed8c505a686ca08d270493404c1db86e64b9494ee36cf"),
  key: bits(254),
  prize: 0.254,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.254,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.254,
    ),
  ],
});
