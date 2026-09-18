import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/45`. */
export const b1000Puzzle45 = bitcoinPuzzle({
  id: "b1000/45",
  address: p2pkh("1NtiLNGegHWE3Mp9g2JPkgx6wUg4TW7bbk", "f0225bfc68a6e17e87cd8b5e60ae3be18f120753"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("026ecabd2d22fdb737be21975ce9a694e108eb94f3649c586cc7461c8abf5da71a"),
  key: hex("0000000000000000000000000000000000000000000000000000122fca143c05", 45).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgdDrgx63tbte4scLA",
  ),
  prize: 0.045,
  solvedAt: "2015-01-30 18:24:18",
  solveTime: 1297024,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.045,
    ),
    claim(
      "26dbcd4f8bbd5007385fc79954ba238bc684c305d565c60146549bb5acc3f329",
      "2015-01-30 18:24:18",
      0.045,
    ),
  ],
});
