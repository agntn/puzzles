import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/206`. */
export const b1000Puzzle206 = bitcoinPuzzle({
  id: "b1000/206",
  address: p2pkh("1UwsEPMF1NZTWJAuymsLVJpqetBZ3Q9sJ", "054907e50b2feceb0b75f850fd764c197844fea0"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("0291a1ff9572bcbafd8dabe85c90e10a458a4f71e759747918d4aa1f56af8a66af"),
  key: bits(206),
  prize: 0.206,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.206,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.206,
    ),
  ],
});
