import { puzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex } from "../../core/parts.ts";

/** Puzzle `bits/8`. */
export const bits8 = puzzle({
  id: "bits/8",
  chain: "bitcoin",
  address: "1M92tSqNmQLYw33fuBvjmeadirh1ysMBxK",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("0308bc89c2f919ed158885c35600844d49890905c79b357322609c45706ce6b514"),
  key: hex("00000000000000000000000000000000000000000000000000000000000000e0", 8).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU8xvGK1zpm",
  ),
  prize: 0.008,
  solvedAt: "2015-01-15 18:07:14",
  solveTime: 0,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.008,
    ),
    claim(
      "0827fb603364998f7f24724e2f4f4befd6ada60dbef28f91307fe7a79e98a4f8",
      "2015-01-15 18:07:14",
      0.008,
    ),
  ],
});
