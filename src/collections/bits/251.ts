import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `bits/251`. */
export const bits251 = puzzle({
  id: "bits/251",
  chain: "bitcoin",
  address: "1M3u4q5Q35qtQPmDHeubVbk7APYi3VVoBX",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("02ec2ca969860c67210de88b622f37fd4c02488d8ff9cc879ae91405523724eb0e"),
  key: bits(251),
  prize: 0.251,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.251,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.251,
    ),
  ],
});
