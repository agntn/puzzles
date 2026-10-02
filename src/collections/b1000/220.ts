import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/220`. */
export const b1000Puzzle220 = puzzle({
  id: "b1000/220",
  chain: "bitcoin",
  address: "1rirV4Y2NxGwKNQNojJhz61jEctni8fvb",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("022cc796d5a8ec2c871640152a0db6ffd2b4ea957c8f5ecf706fbc383fa5ad7696"),
  key: bits(220),
  prize: 0.22,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.22,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.22,
    ),
  ],
});
