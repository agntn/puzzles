import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/12`. */
export const b1000Puzzle12 = bitcoinPuzzle({
  id: "b1000/12",
  address: p2pkh("1DBaumZxUkM4qMQRt2LVWyFJq5kDtSZQot", "85a1f9ba4da24c24e582d9b891dacbd1b043f971"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("038b00fcbfc1a203f44bf123fc7f4c91c10a85c8eae9187f9d22242b4600ce781c"),
  key: hex("0000000000000000000000000000000000000000000000000000000000000a7b", 12).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFUW5RtS2JN1",
  ),
  prize: 0.012,
  solvedAt: "2015-01-15 18:07:14",
  solveTime: 0,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.012,
    ),
    claim(
      "5bf0a6d4af73ac148a5b1d26c82d4c7567f45f868f427b48efad7cae08fb22df",
      "2015-01-15 18:07:14",
      0.012,
    ),
  ],
});
