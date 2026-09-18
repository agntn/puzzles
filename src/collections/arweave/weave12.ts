import { arweavePuzzle } from "../../core/puzzle.ts";
import { funding, standard } from "../../core/parts.ts";

/** Puzzle `arweave/weave12`. */
export const arweavePuzzleWeave12 = arweavePuzzle({
  id: "arweave/weave12",
  address: standard("XRGEfkMbCMHeTY9mZI9Lh6hf8EmA8RstmBFUjDm40fg"),
  sourceUrl: "https://arweave.net/gymumAAsxGlzqPL5HzoEB8Xryu61o174j7vHwx21Qoo",
  startedAt: "2020-04-14 09:17:16",
  prize: 400,
  transactions: [
    funding("BregUvA5IRkePHvH6G5fL54ZI-L4JF2TfO7NyRj6U-Y", "2020-04-14 09:17:16", 400),
  ],
});
