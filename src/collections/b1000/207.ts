import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/207`. */
export const b1000Puzzle207 = bitcoinPuzzle({
  id: "b1000/207",
  address: p2pkh("16aELF1f75o464ZhtAZUwbc4ctFQZxS8qi", "3d217c047cabb55395cd9618cee124683ea5c998"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("030fb4b479aaa51c07c2f660501ccf73a6aaef84e2065ad1dcf97125a5d7248258"),
  key: bits(207),
  prize: 0.207,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.207,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.207,
    ),
  ],
});
