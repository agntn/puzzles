import { puzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex } from "../../core/parts.ts";

/** Puzzle `bits/10`. */
export const bits10 = puzzle({
  id: "bits/10",
  chain: "bitcoin",
  address: "1LeBZP5QCwwgXRtmVUvTVrraqPUokyLHqe",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("03a7a4c30291ac1db24b4ab00c442aa832f7794b5a0959bec6e8d7fee802289dcd"),
  key: hex("0000000000000000000000000000000000000000000000000000000000000202", 10).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFUBTL67V6dE",
  ),
  prize: 0.01,
  solvedAt: "2015-01-15 18:07:14",
  solveTime: 0,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.01,
    ),
    claim(
      "b70f19f2581acf4320cf069379982f2df6f9c8b8ef91ed59279e32453a81ad62",
      "2015-01-15 18:07:14",
      0.01,
    ),
  ],
});
