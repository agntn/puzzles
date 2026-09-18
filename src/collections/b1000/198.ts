import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/198`. */
export const b1000Puzzle198 = bitcoinPuzzle({
  id: "b1000/198",
  address: p2pkh("12jFRwZFUrxUTtuyVzw9FNJsJa7mjBgfca", "12f5a4496acc2393b6b56408ae7b3e07b6dc9b93"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("0245f61026852cde2db15de4b129ad0e3c54aba03ed9b0f676eb9dfb680277d569"),
  key: bits(198),
  prize: 0.198,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.198,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.198,
    ),
  ],
});
