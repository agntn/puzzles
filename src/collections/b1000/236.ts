import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/236`. */
export const b1000Puzzle236 = bitcoinPuzzle({
  id: "b1000/236",
  address: p2pkh("1PytbQzRaf9eTpGax3c6ofKwtbxaLLSNy1", "fc152109a2102e72ae6aca2192065e909170d2c3"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("03e8c806fd610232c5b68d824b3a284e213e523492657965073c54ccaa8a58e8c6"),
  key: bits(236),
  prize: 0.236,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.236,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.236,
    ),
  ],
});
