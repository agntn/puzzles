import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `bits/216`. */
export const bits216 = puzzle({
  id: "bits/216",
  chain: "bitcoin",
  address: "197K7MdYhnN88gcJouJRxMiSAHHfWuPrXC",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("022f02cc3458301883c9bd15fe341384f94ce48076f836815f7b89901f3a27abc4"),
  key: bits(216),
  prize: 0.216,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.216,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.216,
    ),
  ],
});
