import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/56`. */
export const b1000Puzzle56 = bitcoinPuzzle({
  id: "b1000/56",
  address: p2pkh("17aPYR1m6pVAacXg1PTDDU7XafvK1dxvhi", "48214c5969ae9f43f75070cea1e2cb41d5bdcccd"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("033f2db2074e3217b3e5ee305301eeebb1160c4fa1e993ee280112f6348637999a"),
  key: hex("000000000000000000000000000000000000000000000000009d18b63ac4ffdf", 56).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjjb65nDHeqyjiBaJXv",
  ),
  prize: 0.56,
  solvedAt: "2018-09-08 05:45:09",
  solveTime: 115040275,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.056,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.504,
    ),
    claim(
      "5317fdbea32034f8f983bd2324e99e5da593aaf3c4aed6425d8104dc3b8c77d2",
      "2018-09-08 05:45:09",
      0.504,
    ),
  ],
});
