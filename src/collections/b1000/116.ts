import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, funding, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/116`. */
export const b1000Puzzle116 = bitcoinPuzzle({
  id: "b1000/116",
  address: p2pkh("1MnJ6hdhvK37VLmqcdEwqC3iFxyWH2PHUV", "e3f381c34a20da049779b44cae0417c7fb2898d0"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  key: bits(116),
  prize: 11.600012,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.116,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      1.044,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      10.44,
    ),
    increase(
      "0e10fc1cc2288bb2df6dc15a29827aaa71724e1f93bc29b9bc7b9882fde97645",
      "2025-03-16 03:24:47",
      0.0000121,
    ),
  ],
});
