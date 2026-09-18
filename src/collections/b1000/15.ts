import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/15`. */
export const b1000Puzzle15 = bitcoinPuzzle({
  id: "b1000/15",
  address: p2pkh("1QCbW9HWnwQWiQqVo5exhAnmfqKRrCRsvW", "fe7c45126731f7384640b0b0045fd40bac72e2a2"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("02fea58ffcf49566f6e9e9350cf5bca2861312f422966e8db16094beb14dc3df2c"),
  key: hex("00000000000000000000000000000000000000000000000000000000000068f3", 15).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFY5iMZbuRxj",
  ),
  prize: 0.015,
  solvedAt: "2015-01-15 18:07:14",
  solveTime: 0,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.015,
    ),
    claim(
      "b82f780d5619131a0f98eb0bcfc2f01ce4b3997bc0066d9498b22073c163f4cf",
      "2015-01-15 18:07:14",
      0.015,
    ),
  ],
});
