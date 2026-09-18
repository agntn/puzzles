import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/34`. */
export const b1000Puzzle34 = bitcoinPuzzle({
  id: "b1000/34",
  address: p2pkh("1PWABE7oUahG2AFFQhhvViQovnCr4rEv7Q", "f6d67d7983bf70450f295c9cb828daab265f1bfa"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("033cdd9d6d97cbfe7c26f902faf6a435780fe652e159ec953650ec7b1004082790"),
  key: hex("000000000000000000000000000000000000000000000000000000034a65911d", 34).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9MJaAKqns7PN9Ra",
  ),
  prize: 0.034,
  solvedAt: "2015-01-17 00:14:34",
  solveTime: 108440,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.034,
    ),
    claim(
      "03da907c6b671764ee78fcca78e126c781640efb691d011f5aff0f09072a6104",
      "2015-01-17 00:14:34",
      0.034,
    ),
  ],
});
