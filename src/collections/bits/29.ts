import { puzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex } from "../../core/parts.ts";

/** Puzzle `bits/29`. */
export const bits29 = puzzle({
  id: "bits/29",
  chain: "bitcoin",
  address: "19EEC52krRUK1RkUAEZmQdjTyHT7Gp1TYT",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("026caad634382d34691e3bef43ed4a124d8909a8a3362f91f1d20abaaf7e917b36"),
  key: hex("0000000000000000000000000000000000000000000000000000000017e2551e", 29).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M89tAnjFUUDRtJ",
  ),
  prize: 0.029,
  solvedAt: "2015-01-16 02:46:38",
  solveTime: 31164,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.029,
    ),
    claim(
      "c9878a6de4f0d482020411aa870eb3f6ca04b3dd1b2cf3ac5cf1ae265196e269",
      "2015-01-16 02:46:38",
      0.029,
    ),
  ],
});
