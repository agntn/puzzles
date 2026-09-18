import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/161`. */
export const b1000Puzzle161 = bitcoinPuzzle({
  id: "b1000/161",
  address: p2pkh("1JkqBQcC4tHcb1JfdCH6nrWYwTPGznHANh", "c2c43e2b16f53c713bc00307140eaae188413544"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("031dcf49b480cee5f1a7200ea94795a1c7f69e144f11f031123c14c65077823dcb"),
  key: bits(161),
  prize: 0.161,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.161,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.161,
    ),
  ],
});
