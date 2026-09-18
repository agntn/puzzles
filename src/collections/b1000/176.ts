import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/176`. */
export const b1000Puzzle176 = bitcoinPuzzle({
  id: "b1000/176",
  address: p2pkh("1NcytLwdqJa8DsQPa9NwkxJTQcx1rZy85A", "ed28af7ebd057c69f2f9f5852fcff8da51b32571"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("02ba9f479c758f5b2842ddef8414e70acfc943d2584258709352061a100e410ee4"),
  key: bits(176),
  prize: 0.176,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.176,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.176,
    ),
  ],
});
