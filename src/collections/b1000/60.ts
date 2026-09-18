import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/60`. */
export const b1000Puzzle60 = bitcoinPuzzle({
  id: "b1000/60",
  address: p2pkh("1Kn5h2qpgw9mWE5jKpk8PP4qvvJ1QVy8su", "cdf8e5c7503a9d22642e3ecfc87817672787b9c5"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("0348e843dc5b1bd246e6309b4924b81543d02b16c8083df973a89ce2c7eb89a10d"),
  key: hex("0000000000000000000000000000000000000000000000000fc07a1825367bbe", 60).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYkzijLsc5qE43yZ5eLV",
  ),
  prize: 0.6,
  solvedAt: "2019-02-17 11:59:52",
  solveTime: 129059558,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.06,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.54,
    ),
    claim(
      "6c08747ecd15904128c3f15f3bf47f6f365405da2661f17eb5119008807cee3e",
      "2019-02-17 11:59:52",
      0.6,
    ),
  ],
});
