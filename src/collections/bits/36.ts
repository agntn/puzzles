import { puzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex } from "../../core/parts.ts";

/** Puzzle `bits/36`. */
export const bits36 = puzzle({
  id: "bits/36",
  chain: "bitcoin",
  address: "1Be2UF9NLfyLFbtm3TCbmuocc9N1Kduci1",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("02b3e772216695845fa9dda419fb5daca28154d8aa59ea302f05e916635e47b9f6"),
  key: hex("00000000000000000000000000000000000000000000000000000009de820a7c", 36).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9Mg1Upu7eJAtiDr",
  ),
  prize: 0.036,
  solvedAt: "2015-01-17 17:14:40",
  solveTime: 169646,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.036,
    ),
    claim(
      "ef14a1ad1e267ffa71c2d6d719e094a444a0fce6658b47132df7b7c1d95b95b2",
      "2015-01-17 17:14:40",
      0.036,
    ),
  ],
});
