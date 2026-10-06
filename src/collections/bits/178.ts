import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `bits/178`. */
export const bits178 = puzzle({
  id: "bits/178",
  chain: "bitcoin",
  address: "12ATwA5VvoPDinSymcQpCAXPLApAVLN24z",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("035fd8708ca357691c50a49b0d339227360049b3156c3d32d1c54a315393bda35e"),
  key: bits(178),
  prize: 0.178,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.178,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.178,
    ),
  ],
});
