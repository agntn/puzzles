import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, funding, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/84`. */
export const b1000Puzzle84 = bitcoinPuzzle({
  id: "b1000/84",
  address: p2pkh("1CMq3SvFcVEcpLMuuH8PUcNiqsK1oicG2D", "7c99ce73e19f9fbfcce4825ae88261e2b0b0b040"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  key: bits(84),
  prize: 8.400015,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.084,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.756,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      7.56,
    ),
    increase(
      "99e69ed74aa55f1f92e946909dd2f7e7b488721e3b82aee27fe82f30aef47d0e",
      "2025-10-28 12:03:12",
      0.000015,
    ),
  ],
});
