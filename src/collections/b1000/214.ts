import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/214`. */
export const b1000Puzzle214 = bitcoinPuzzle({
  id: "b1000/214",
  address: p2pkh("16ocVeZDpqcvyMvzAH1r2LR75uEzRhkyV2", "3fa96459d3e03e94794724b8605c9ae47a106862"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("033fb8f6eb9cd60aca4f5ec48c7bd81fbe2c221c7701bcb93be5f50a810055c965"),
  key: bits(214),
  prize: 0.214,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.214,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.214,
    ),
  ],
});
