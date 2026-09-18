import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/194`. */
export const b1000Puzzle194 = bitcoinPuzzle({
  id: "b1000/194",
  address: p2pkh("1oW8VFRNVKhbzzq8NWNutDYDzv1CzAHAj", "08cb7331dccb902b5db0a30dcc1ba8adbd6fe4d0"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("024e951c7b8d0630a84f5f79b6a8ddae01ff2166f322fc4558d20c97aacd8f2839"),
  key: bits(194),
  prize: 0.194,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.194,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.194,
    ),
  ],
});
