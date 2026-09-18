import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/164`. */
export const b1000Puzzle164 = bitcoinPuzzle({
  id: "b1000/164",
  address: p2pkh("1LjQKurNtEDgMdqeCoWRFhHp1FPnLU77Q4", "d86f54f73e343d76dd7401639e427d828ba31eab"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("0312163c60548244d6e565bd877b98808b73830c537efde357c8b5f8c623fb2028"),
  key: bits(164),
  prize: 0.164,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.164,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.164,
    ),
  ],
});
