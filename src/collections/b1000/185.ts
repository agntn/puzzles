import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/185`. */
export const b1000Puzzle185 = bitcoinPuzzle({
  id: "b1000/185",
  address: p2pkh("1HqHHuFzZhtTtyGbAWCS49qGnCBSEhBSFT", "b8a393fd03783ac177243e8c4313a4221b049b8a"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("0208ce81549c729647d7747a6a7e304104435fae445afb4fa90fd384f2640f0ed9"),
  key: bits(185),
  prize: 0.185,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.185,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.185,
    ),
  ],
});
