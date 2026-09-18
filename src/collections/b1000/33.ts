import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/33`. */
export const b1000Puzzle33 = bitcoinPuzzle({
  id: "b1000/33",
  address: p2pkh("187swFMjz1G54ycVU56B7jZFHFTNVQFDiu", "4e15e5189752d1eaf444dfd6bff399feb0443977"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("03a355aa5e2e09dd44bb46a4722e9336e9e3ee4ee4e7b7a0cf5785b283bf2ab579"),
  key: hex("00000000000000000000000000000000000000000000000000000001a96ca8d8", 33).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9MDGKrXXQL647jj",
  ),
  prize: 0.033,
  solvedAt: "2015-01-16 16:43:28",
  solveTime: 81374,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.033,
    ),
    claim(
      "718f7962432312acda2aeecdf18e94f5960f51013cc4d38134e7493c21e77baf",
      "2015-01-16 16:43:28",
      0.033,
    ),
  ],
});
