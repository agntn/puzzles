import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `bits/175`. */
export const bits175 = puzzle({
  id: "bits/175",
  chain: "bitcoin",
  address: "1DxZJy7AkqLVAQ5rtSUKfrR3yPE5u5ygk6",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("02cb5f1f0d3dd67f0f162353490d98219982f5095bd32daa6c020806cf59ea2c2e"),
  key: bits(175),
  prize: 0.175,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.175,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.175,
    ),
  ],
});
