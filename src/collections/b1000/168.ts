import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/168`. */
export const b1000Puzzle168 = bitcoinPuzzle({
  id: "b1000/168",
  address: p2pkh("1PojqbbzJHnn1X2mv6DCECNLUaD2nMssDp", "fa29a9264b9c18fa5925e38d201934ed89e64dd6"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("02788f82521d7557d30c9c4f8bc7098cda23c59729e9cf96057ea1dc49799bd399"),
  key: bits(168),
  prize: 0.168,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.168,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.168,
    ),
  ],
});
