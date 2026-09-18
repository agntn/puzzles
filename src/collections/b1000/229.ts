import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/229`. */
export const b1000Puzzle229 = bitcoinPuzzle({
  id: "b1000/229",
  address: p2pkh("1AaBhpTnfCin9nCrai2msXzCHoVmwkAe2N", "68ffcb39707615a254428f084c859376fa7144be"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("020d64789d26c0363a2f284a1cddad7b6ab7dd41d65d5afe6ce7554214d4666518"),
  key: bits(229),
  prize: 0.229,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.229,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.229,
    ),
  ],
});
