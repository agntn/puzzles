import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, funding, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/72`. */
export const b1000Puzzle72 = bitcoinPuzzle({
  id: "b1000/72",
  address: p2pkh("1JTK7s9YVYywfm5XUH7RNhHJH1LshCaRFR", "bf7413e8df4e7a34ce9dc13e2f2648783ec54adb"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  key: bits(72),
  prize: 7.200144,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.072,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.648,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      6.48,
    ),
    increase(
      "7d7dc5027ad971387295921620df609642fb4040a782a6b795be71c1e821ae93",
      "2023-09-25 15:00:17",
      0.00003779,
    ),
    increase(
      "caa959d2e425bd209e5ae73348b247716c71e56b8216aeccf7685733edd08631",
      "2025-01-28 07:27:07",
      0.000006,
    ),
    increase(
      "4b7c35b7ca546193090d58aaf4746f2d5c08fa024bab23f13d8aff3d7a15e030",
      "2025-08-06 12:50:58",
      0.0001,
    ),
  ],
});
