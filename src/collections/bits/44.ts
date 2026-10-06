import { puzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex } from "../../core/parts.ts";

/** Puzzle `bits/44`. */
export const bits44 = puzzle({
  id: "bits/44",
  chain: "bitcoin",
  address: "1CkR2uS7LmFwc3T2jV8C1BhWb5mQaoxedF",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("025e466e97ed0e7910d3d90ceb0332df48ddf67d456b9e7303b50a3d89de357336"),
  key: hex("00000000000000000000000000000000000000000000000000000e02b35a358f", 44).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgdCpdGyxm7PWoNQdr",
  ),
  prize: 0.044,
  solvedAt: "2015-01-30 18:24:18",
  solveTime: 1297024,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.044,
    ),
    claim(
      "26dbcd4f8bbd5007385fc79954ba238bc684c305d565c60146549bb5acc3f329",
      "2015-01-30 18:24:18",
      0.044,
    ),
  ],
});
