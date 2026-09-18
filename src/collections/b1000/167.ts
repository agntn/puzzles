import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/167`. */
export const b1000Puzzle167 = bitcoinPuzzle({
  id: "b1000/167",
  address: p2pkh("1AvLwGpkwTZH4qiwy1L4v6TuWXLMNrATN5", "6ccfd1cdb43788738536e11e247b0ce31c093f0f"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("03779c01b4badc5c3883f6ea2b93214a24796154c8eb967695dfc802bf074b4941"),
  key: bits(167),
  prize: 0.167,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.167,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.167,
    ),
  ],
});
