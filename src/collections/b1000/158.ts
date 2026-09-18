import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, funding, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/158`. */
export const b1000Puzzle158 = bitcoinPuzzle({
  id: "b1000/158",
  address: p2pkh("19z6waranEf8CcP8FqNgdwUe1QRxvUNKBG", "628dacebb0faa7f81670e174ca4c8a95a7e37029"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  key: bits(158),
  prize: 15.80001,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.158,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      1.422,
    ),
    increase(
      "e1f668b8cc9915fcd3de6ec922acf98cdf4c14f75de9530b6ad750693d44076b",
      "2021-08-19 15:55:55",
      0.00001,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      14.22,
    ),
  ],
});
