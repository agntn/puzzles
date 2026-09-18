import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/205`. */
export const b1000Puzzle205 = bitcoinPuzzle({
  id: "b1000/205",
  address: p2pkh("1DHL5NuXPjwDsNnXyzAgZTAMM4aYUc1zFW", "86b816944ed6fce46ca955b80897996b016f8be0"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("030fad8d46d7a7f4e5b5c76a09a05166c8f7515651f0c73bf8329353f412699c99"),
  key: bits(205),
  prize: 0.205,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.205,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.205,
    ),
  ],
});
