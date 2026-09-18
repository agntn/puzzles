import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, funding, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/118`. */
export const b1000Puzzle118 = bitcoinPuzzle({
  id: "b1000/118",
  address: p2pkh("1PJZPzvGX19a7twf5HyD2VvNiPdHLzm9F6", "f4a4e1c11a5bbbd2fc139d221825407c66e0b8b4"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  key: bits(118),
  prize: 11.800007,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.118,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      1.062,
    ),
    increase(
      "8c389a5038ef933ad14b81781971e91679cbd563c4ee29c1efa7a9e629ab2d8b",
      "2021-10-05 07:06:59",
      0.00000661,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      10.62,
    ),
  ],
});
