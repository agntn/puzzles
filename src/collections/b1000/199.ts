import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/199`. */
export const b1000Puzzle199 = bitcoinPuzzle({
  id: "b1000/199",
  address: p2pkh("1BNkFNU3eJz8jDfTkTwe7XmF18BfQwfqW7", "71ce182dba6c2838d69248017141117721a7200a"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("03ec5cd862b5699f09e5341b4315b2a548024718fe9ce70d205dbfbbface07d7ee"),
  key: bits(199),
  prize: 0.199,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.199,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.199,
    ),
  ],
});
