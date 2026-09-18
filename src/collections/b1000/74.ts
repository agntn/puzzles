import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, funding, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/74`. */
export const b1000Puzzle74 = bitcoinPuzzle({
  id: "b1000/74",
  address: p2pkh("1FWGcVDK3JGzCC3WtkYetULPszMaK2Jksv", "9f1adb20baeacc38b3f49f3df6906a0e48f2df3d"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  key: bits(74),
  prize: 7.40005,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.074,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.666,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      6.66,
    ),
    increase(
      "49548037c2bc4a22da68dd097be67d98a1e8f47aeaaac6fb92751f755e7d89eb",
      "2023-09-25 15:00:17",
      0.00003777,
    ),
    increase(
      "480f8e96b46315d494fecc06f035e782179e5d9aae7e7417be55c63ff96f06e8",
      "2025-01-28 03:11:55",
      0.000006,
    ),
    increase(
      "89993b4ff06bc6ee94af5b7e78888cbcbdefa38335a53342e4d371f70fa472e6",
      "2025-02-10 06:05:27",
      0.000006,
    ),
  ],
});
