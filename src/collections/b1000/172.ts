import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/172`. */
export const b1000Puzzle172 = bitcoinPuzzle({
  id: "b1000/172",
  address: p2pkh("15LJKhwQJ7dYMBZX1mktskZqxX1aUCibkr", "2f86ddd3fac7bf830020f97c46b33aabc891e132"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("02ed75f534f534c536d0732acd70af3e0d173c1f6885381edf8469d1e5a4cae716"),
  key: bits(172),
  prize: 0.172,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.172,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.172,
    ),
  ],
});
