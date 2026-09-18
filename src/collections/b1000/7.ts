import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/7`. */
export const b1000Puzzle7 = bitcoinPuzzle({
  id: "b1000/7",
  address: p2pkh("1McVt1vMtCC7yn5b9wgX1833yCcLXzueeC", "e2192e8a7dd8dd1c88321959b477968b941aa973"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("0296516a8f65774275278d0d7420a88df0ac44bd64c7bae07c3fe397c5b3300b23"),
  key: hex("000000000000000000000000000000000000000000000000000000000000004c", 7).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU7hDgvu64y",
  ),
  prize: 0.007,
  solvedAt: "2015-01-15 18:07:14",
  solveTime: 0,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.007,
    ),
    claim(
      "09817b72199818d5610d44f9427f87c84ef3905004b751c5198059188e2de9b4",
      "2015-01-15 18:07:14",
      0.007,
    ),
  ],
});
