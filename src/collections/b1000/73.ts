import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, funding, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/73`. */
export const b1000Puzzle73 = bitcoinPuzzle({
  id: "b1000/73",
  address: p2pkh("12VVRNPi4SJqUTsp6FmqDqY5sGosDtysn4", "105b7f253f0ebd7843adaebbd805c944bfb863e4"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  key: bits(73),
  prize: 7.300138,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.073,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.657,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      6.57,
    ),
    increase(
      "cd85afbaa9901d8ede400248713942ff56cfe92806500940624b671f947f508b",
      "2023-09-25 15:00:17",
      0.00003777,
    ),
    increase(
      "d1824b78030f9d670b2e8aaedd1cc9b042951f96a59ad59790a35917bfbdfc54",
      "2025-01-27 14:10:18",
      0.000006,
    ),
    increase(
      "d39bfb73aa05305025c7179d0477201403219556d8d56c7d038c934a08e85e91",
      "2025-11-24 09:49:26",
      0.00009472,
    ),
  ],
});
