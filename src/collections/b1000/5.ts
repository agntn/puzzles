import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/5`. */
export const b1000Puzzle5 = bitcoinPuzzle({
  id: "b1000/5",
  address: p2pkh("1E6NuFjCi27W5zoXg8TRdcSRq84zJeBW3k", "8f9dff39a81ee4abcbad2ad8bafff090415a2be8"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("02352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5"),
  key: hex("0000000000000000000000000000000000000000000000000000000000000015", 5).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU7Dq8Au4Pv",
  ),
  prize: 0.005,
  solvedAt: "2015-01-15 18:07:14",
  solveTime: 0,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.005,
    ),
    claim(
      "4f5a32521f352d48cc4491c6de3485764997c0cd089f63e822f4e7ed05015d20",
      "2015-01-15 18:07:14",
      0.005,
    ),
  ],
});
