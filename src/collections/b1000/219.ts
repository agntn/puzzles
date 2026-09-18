import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/219`. */
export const b1000Puzzle219 = bitcoinPuzzle({
  id: "b1000/219",
  address: p2pkh("1EiJ59LPWDezXwfAGFTcoEKdNhvRTriBXy", "9668f0ad5f1eaa5c8e68baf1eaa07c1ea16a88de"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("02ef830a543b3b50c3fc7e42bbc0938039f8d3e19a1e862012f281c51f3581d77d"),
  key: bits(219),
  prize: 0.219,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.219,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.219,
    ),
  ],
});
