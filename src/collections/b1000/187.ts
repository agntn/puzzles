import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/187`. */
export const b1000Puzzle187 = bitcoinPuzzle({
  id: "b1000/187",
  address: p2pkh("19ct7Egfi5j6jSefj8X4d5eXJQUmyhtXjC", "5e8a3a32df85af78e2ce3493985ff4ae2da00623"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("028393d6e394d960b1b7e239707d87595f85b7bdca480dafd39d4797124740d9ef"),
  key: bits(187),
  prize: 0.187,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.187,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.187,
    ),
  ],
});
