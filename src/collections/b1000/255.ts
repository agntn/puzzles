import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/255`. */
export const b1000Puzzle255 = bitcoinPuzzle({
  id: "b1000/255",
  address: p2pkh("17PEUvQmgqPkkvRkMowoR1wRDXYzre4b9Z", "460528d920ce045d9f6fc319182960707b248064"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("030cea4a0ee0a03b7a5f77b85bb455b10979c2220f0e470ce5e0d4e0c786c04f66"),
  key: bits(255),
  prize: 0.255,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.255,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.255,
    ),
  ],
});
