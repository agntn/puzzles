import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/57`. */
export const b1000Puzzle57 = bitcoinPuzzle({
  id: "b1000/57",
  address: p2pkh("15c9mPGLku1HuW9LRtBf4jcHVpBUt8txKz", "328660ef43f66abe2653fa178452a5dfc594c2a1"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("02a521a07e98f78b03fc1e039bc3a51408cd73119b5eb116e583fe57dc8db07aea"),
  key: hex("00000000000000000000000000000000000000000000000001eb25c90795d61c", 57).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjqtiAvYTJzYEmqup7b",
  ),
  prize: 0.57,
  solvedAt: "2018-11-08 01:03:19",
  solveTime: 120293765,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.057,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.513,
    ),
    claim(
      "fd773819f5fb5d672d32bfe99e30af086e86c2c2b35dd7cfe337bf8960a96aa7",
      "2018-11-08 01:03:19",
      0.57,
    ),
  ],
});
