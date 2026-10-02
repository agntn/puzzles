import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/213`. */
export const b1000Puzzle213 = puzzle({
  id: "b1000/213",
  chain: "bitcoin",
  address: "1CNNth43uiVypxHmZLC8hWZsb7UiP7wSkY",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("024b5c68b748907bc07afa2f4d9cfeef5524d0675ee4b5a39f2e9e7b7b85f2bd9f"),
  key: bits(213),
  prize: 0.213,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.213,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.213,
    ),
  ],
});
