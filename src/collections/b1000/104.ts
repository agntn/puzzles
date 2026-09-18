import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, funding, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/104`. */
export const b1000Puzzle104 = bitcoinPuzzle({
  id: "b1000/104",
  address: p2pkh("1EQJvpsmhazYCcKX5Au6AZmZKRnzarMVZu", "93022af9a38f3ebb0c3f15dd1c83f8fadaf64e74"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  key: bits(104),
  prize: 10.400016,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.104,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.936,
    ),
    increase(
      "a83225cc95582f66fb42d285c64c52a6a6b6b2cec715e2429c67e3f3243071d0",
      "2023-02-02 21:40:21",
      0.000006,
    ),
    increase(
      "123c8804d6d28510c7c11a1b56ea36b4caa1e86f7e6edaf64ee65d16bf9fad67",
      "2023-02-04 01:25:54",
      0.00001,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      9.36,
    ),
  ],
});
