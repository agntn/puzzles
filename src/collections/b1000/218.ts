import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/218`. */
export const b1000Puzzle218 = bitcoinPuzzle({
  id: "b1000/218",
  address: p2pkh("1BDTXmiyyzq9i79RGGTW7cjmYJbxKoV27e", "700c655d586d1a06b0185b12007a1b195d60271c"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("03d8c17e24c72388998ebe82837a555e57d1db6162738cec8963384c367e393906"),
  key: bits(218),
  prize: 0.218,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.218,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.218,
    ),
  ],
});
