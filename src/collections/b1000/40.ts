import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/40`. */
export const b1000Puzzle40 = bitcoinPuzzle({
  id: "b1000/40",
  address: p2pkh("1EeAxcprB2PpCnr34VfZdFrkUWuxyiNEFv", "95a156cd21b4a69de969eb6716864f4c8b82a82a"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("03a2efa402fd5268400c77c20e574ba86409ededee7c4020e4b9f0edbee53de0d4"),
  key: hex("000000000000000000000000000000000000000000000000000000e9ae4933d6", 40).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9aFJuCJDo5F6Jm7",
  ),
  prize: 0.04,
  solvedAt: "2015-01-30 18:24:18",
  solveTime: 1297024,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.04,
    ),
    claim(
      "26dbcd4f8bbd5007385fc79954ba238bc684c305d565c60146549bb5acc3f329",
      "2015-01-30 18:24:18",
      0.04,
    ),
  ],
});
