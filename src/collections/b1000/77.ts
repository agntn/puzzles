import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, funding, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/77`. */
export const b1000Puzzle77 = bitcoinPuzzle({
  id: "b1000/77",
  address: p2pkh("1Bxk4CQdqL9p22JEtDfdXMsng1XacifUtE", "783c138ac81f6a52398564bb17455576e8525b29"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  key: bits(77),
  prize: 7.700024,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.077,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.693,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      6.93,
    ),
    increase(
      "8c161394a9cd1f201b0f6d4898cb5cfdff9399f618eee6c1ddf1b76b56e96e71",
      "2023-11-29 09:47:58",
      0.00001826,
    ),
    increase(
      "599bfd6ded754b082dcff0eec969a436ffa9cc888ac515dfe2d5ad4fa96f287f",
      "2025-01-27 18:29:28",
      0.000006,
    ),
  ],
});
