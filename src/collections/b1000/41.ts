import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/41`. */
export const b1000Puzzle41 = bitcoinPuzzle({
  id: "b1000/41",
  address: p2pkh("1L5sU9qvJeuwQUdt4y1eiLmquFxKjtHr3E", "d1562eb37357f9e6fc41cb2359f4d3eda4032329"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("03b357e68437da273dcf995a474a524439faad86fc9effc300183f714b0903468b"),
  key: hex("00000000000000000000000000000000000000000000000000000153869acc5b", 41).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9gCD9CBomewdcUD",
  ),
  prize: 0.041,
  solvedAt: "2015-01-30 18:24:18",
  solveTime: 1297024,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.041,
    ),
    claim(
      "26dbcd4f8bbd5007385fc79954ba238bc684c305d565c60146549bb5acc3f329",
      "2015-01-30 18:24:18",
      0.041,
    ),
  ],
});
