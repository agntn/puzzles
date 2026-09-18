import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/163`. */
export const b1000Puzzle163 = bitcoinPuzzle({
  id: "b1000/163",
  address: p2pkh("1H6e7SLxv6ZUbuAaZpeUdVNfh3cKBWJRmx", "b093122f7fb36d11c9f2c80cff2971fba7c9c1ff"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("02ee740ba74efc08bf39d01ccb7e34f50afe2f4677a9e09755e7fe3808e0cbbac9"),
  key: bits(163),
  prize: 0.163,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.163,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.163,
    ),
  ],
});
