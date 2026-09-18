import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/174`. */
export const b1000Puzzle174 = bitcoinPuzzle({
  id: "b1000/174",
  address: p2pkh("1C6dHU1gQtVUXZmeXQuQc3EgDJbiLbxFZJ", "79b9c06f479cde2a04c871b7534f1d4706c6411a"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("03c11209f91946eb81b603d046a296f5754967897d471980fe43ea1aec8bf2ad7c"),
  key: bits(174),
  prize: 0.174,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.174,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.174,
    ),
  ],
});
