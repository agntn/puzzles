import { puzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex } from "../../core/parts.ts";

/** Puzzle `bits/47`. */
export const bits47 = puzzle({
  id: "bits/47",
  chain: "bitcoin",
  address: "1Pd8VvT49sHKsmqrQiP61RsVwmXCZ6ay7Z",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("023a12bd3caf0b0f77bf4eea8e7a40dbe27932bf80b19ac72f5f5a64925a594196"),
  key: hex("00000000000000000000000000000000000000000000000000006cd610b53cba", 47).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgdcLTenJYVVVTRzxN",
  ),
  prize: 0.047,
  solvedAt: "2015-09-01 20:20:24",
  solveTime: 19793590,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.047,
    ),
    claim(
      "39553513f731ae20f98f3307e863f0aecee9842f22273bb2ddfc0fb6ba481c5e",
      "2015-09-01 20:20:24",
      0.047,
    ),
  ],
});
