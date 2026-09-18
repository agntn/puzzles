import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/53`. */
export const b1000Puzzle53 = bitcoinPuzzle({
  id: "b1000/53",
  address: p2pkh("15K1YKJMiJ4fpesTVUcByoz334rHmknxmT", "2f4870ef54fa4b048c1365d42594cc7d3d269551"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("020faaf5f3afe58300a335874c80681cf66933e2a7aeb28387c0d28bb048bc6349"),
  key: hex("00000000000000000000000000000000000000000000000000180788e47e326c", 53).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjh5SmqrUoK2mhwSYFV",
  ),
  prize: 0.53,
  solvedAt: "2017-09-04 20:23:27",
  solveTime: 83211373,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.053,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.477,
    ),
    claim(
      "0e343c3640fa8cc1f7a97556255f46a08b89bd7d1b62ca94b86b37e51835b3b3",
      "2017-09-04 20:23:27",
      0.53,
    ),
  ],
});
