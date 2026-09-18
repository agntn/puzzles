import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/18`. */
export const b1000Puzzle18 = bitcoinPuzzle({
  id: "b1000/18",
  address: p2pkh("1GnNTmTVLZiqQfLbAdp9DVdicEnB5GoERE", "ad1e852b08eba53df306ec9daa8c643426953f94"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("020ce4a3291b19d2e1a7bf73ee87d30a6bdbc72b20771e7dfff40d0db755cd4af1"),
  key: hex("000000000000000000000000000000000000000000000000000000000003080d", 18).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFyWkjT5fywW",
  ),
  prize: 0.018,
  solvedAt: "2015-01-15 18:07:14",
  solveTime: 0,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.018,
    ),
    claim(
      "f785502a72d26cd6b6d26da5d5b4917f2fc5b74e57d7a139f4b7c2275acf2b62",
      "2015-01-15 18:07:14",
      0.018,
    ),
  ],
});
