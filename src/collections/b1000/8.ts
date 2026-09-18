import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/8`. */
export const b1000Puzzle8 = bitcoinPuzzle({
  id: "b1000/8",
  address: p2pkh("1M92tSqNmQLYw33fuBvjmeadirh1ysMBxK", "dce76b2613052ea012204404a97b3c25eac31715"),
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
