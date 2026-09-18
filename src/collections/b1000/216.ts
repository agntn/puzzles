import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/216`. */
export const b1000Puzzle216 = bitcoinPuzzle({
  id: "b1000/216",
  address: p2pkh("197K7MdYhnN88gcJouJRxMiSAHHfWuPrXC", "58f29e811ffece9aaf65c7a360382ebcea3a2f18"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("022f02cc3458301883c9bd15fe341384f94ce48076f836815f7b89901f3a27abc4"),
  key: bits(216),
  prize: 0.216,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.216,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.216,
    ),
  ],
});
