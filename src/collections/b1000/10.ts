import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/10`. */
export const b1000Puzzle10 = bitcoinPuzzle({
  id: "b1000/10",
  address: p2pkh("1LeBZP5QCwwgXRtmVUvTVrraqPUokyLHqe", "d7729816650e581d7462d52ad6f732da0e2ec93b"),
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
