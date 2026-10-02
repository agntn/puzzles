import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/228`. */
export const b1000Puzzle228 = puzzle({
  id: "b1000/228",
  chain: "bitcoin",
  address: "18zsQK8ezT32qCqgLJQMkhqyKNwpCP3JU3",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("037ac4f241f6ba433da340b08a081323a93c0966fca5c0757685005f8396b09628"),
  key: bits(228),
  prize: 0.228,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.228,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.228,
    ),
  ],
});
