import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, funding, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/111`. */
export const b1000Puzzle111 = bitcoinPuzzle({
  id: "b1000/111",
  address: p2pkh("1824ZJQ7nKJ9QFTRBqn7z7dHV5EGpzUpH3", "4cfc43fe12a330c8164251e38c0c0c3c84cf86f6"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  key: bits(111),
  prize: 11.1001,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.111,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.999,
    ),
    increase(
      "0278037d401dd66fab16d5688a203bc776a344232ae107fee0113be1f2d617cd",
      "2022-03-20 22:30:43",
      0.0001,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      9.99,
    ),
  ],
});
