import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/42`. */
export const b1000Puzzle42 = bitcoinPuzzle({
  id: "b1000/42",
  address: p2pkh("1E32GPWgDyeyQac4aJxm9HVoLrrEYPnM4N", "8efb85f9c5b5db2d55973a04128dc7510075ae23"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("03eec88385be9da803a0d6579798d977a5d0c7f80917dab49cb73c9e3927142cb6"),
  key: hex("000000000000000000000000000000000000000000000000000002a221c58d8f", 42).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9zzYEemjCVJ3vo9",
  ),
  prize: 0.042,
  solvedAt: "2015-01-30 18:24:18",
  solveTime: 1297024,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.042,
    ),
    claim(
      "26dbcd4f8bbd5007385fc79954ba238bc684c305d565c60146549bb5acc3f329",
      "2015-01-30 18:24:18",
      0.042,
    ),
  ],
});
