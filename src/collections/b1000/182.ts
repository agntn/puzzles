import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/182`. */
export const b1000Puzzle182 = bitcoinPuzzle({
  id: "b1000/182",
  address: p2pkh("1GZyxmpgtRJNaW1zEhPAa81xZDEJSdwbbZ", "aac6bf269ddce4d550f9c58eedc720b85ba1dc49"),
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
