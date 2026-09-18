import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/4`. */
export const b1000Puzzle4 = bitcoinPuzzle({
  id: "b1000/4",
  address: p2pkh("1EhqbyUMvvs7BfL8goY6qcPbD6YKfPqb7e", "9652d86bedf43ad264362e6e6eba6eb764508127"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("022f01e5e15cca351daff3843fb70f3c2f0a1bdd05e5af888a67784ef3e10a2a01"),
  key: hex("0000000000000000000000000000000000000000000000000000000000000008", 4).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU77MfhviY5",
  ),
  prize: 0.004,
  solvedAt: "2015-01-15 18:07:14",
  solveTime: 0,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.004,
    ),
    claim(
      "7c4f3c3022a956e7ad80bd0d3642f7e2e0a3dd4b275b7241cf1963610250d65b",
      "2015-01-15 18:07:14",
      0.004,
    ),
  ],
});
