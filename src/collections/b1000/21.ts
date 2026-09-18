import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/21`. */
export const b1000Puzzle21 = bitcoinPuzzle({
  id: "b1000/21",
  address: p2pkh("14oFNXucftsHiUMY8uctg6N487riuyXs4h", "29a78213caa9eea824acf08022ab9dfc83414f56"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("031a746c78f72754e0be046186df8a20cdce5c79b2eda76013c647af08d306e49e"),
  key: hex("00000000000000000000000000000000000000000000000000000000001ba534", 21).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rL6JJvw6XUry",
  ),
  prize: 0.021,
  solvedAt: "2015-01-15 19:11:31",
  solveTime: 3857,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.021,
    ),
    claim(
      "cfbfafab6e04041ad36fb2395c2dd384f943ebdf61910c799f8f4a87276b2914",
      "2015-01-15 19:11:31",
      0.021,
    ),
  ],
});
