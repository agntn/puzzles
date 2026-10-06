import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `bits/165`. */
export const bits165 = puzzle({
  id: "bits/165",
  chain: "bitcoin",
  address: "1F7ZjibYug9bLW3YvkkwBZLrhfLtNjgYrX",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("037c6fcde6a2e0fd57ce21bb4352f7bb38859d2af5388b27ebfed107907e060c5c"),
  key: bits(165),
  prize: 0.165,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.165,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.165,
    ),
  ],
});
