import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/217`. */
export const b1000Puzzle217 = bitcoinPuzzle({
  id: "b1000/217",
  address: p2pkh("1MDsNYfC4LErgwUDqfQ5BgFJqv5bs4Frkn", "ddd18e224de138253a990a4cc8d8e7aaa3998914"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("023dccddd7460b8000e6ac7bb14f98cad9aeb4b4f858c2a655738ce141d71224fb"),
  key: bits(217),
  prize: 0.217,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.217,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.217,
    ),
  ],
});
