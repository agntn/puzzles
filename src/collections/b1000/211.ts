import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/211`. */
export const b1000Puzzle211 = bitcoinPuzzle({
  id: "b1000/211",
  address: p2pkh("19yhSoza8oK3ioCSydMuAGJs4Mm3FwCTht", "627a0fd9f1c2034f9d643a355621842288cf4551"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("036f164c6a628d94338a9dc9dfc1cc2f91a3a9382c198bb05f51fbbc34c6cc583e"),
  key: bits(211),
  prize: 0.211,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.211,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.211,
    ),
  ],
});
