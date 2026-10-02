import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/182`. */
export const b1000Puzzle182 = puzzle({
  id: "b1000/182",
  chain: "bitcoin",
  address: "1GZyxmpgtRJNaW1zEhPAa81xZDEJSdwbbZ",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("03f7aafd4bcc8478efb01ff830655d88cb60399e3179e24eb0146b013ee5c4d6a1"),
  key: bits(182),
  prize: 0.182,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.182,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.182,
    ),
  ],
});
