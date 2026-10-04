import { claim, funding, party, uncompressed } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The author's retrospective, with the four Italian addresses and their difficulty. */
const ARTICLE = "https://kf106.medium.com/everyone-loves-a-treasure-hunt-93885ae8d80a";

/** Swept in February 2022, which the author's article files under the medium lot. */
export const moveOverBrokersItEasy = puzzle({
  id: "move-over-brokers/it-easy",
  chain: "bitcoin",
  address: "1MEstvLAzc5DzJtvx7uyvKNNUCPN3ofWMK",
  sourceUrl: ARTICLE,
  startedAt: "2021-09-11 09:28:09",
  status: Status.Claimed,
  pubkey: uncompressed(
    "04f10c61ce57d846cabd47c06efa12ef908db8859ac4342da21d4de99cb5cb99c02205c0c179e5af18be35fb2b58b200c0051c2cc569b97f8fc6a623239bddd04d",
  ),
  prize: 0.002,
  solvedAt: "2022-02-18 03:16:01",
  solveTime: 13_801_672,
  transactions: [
    funding(
      "42919c00a64661e20b8af5719c64d58339e6e492ad21f07f4d38548768cbb23e",
      "2021-09-11 09:28:09",
      0.002,
    ),
    claim(
      "6112c03dda88afeab1ee32dfa9d5aa2f717edd18b959d7d378f4172d3b231efd",
      "2022-02-18 03:16:01",
      0.0019888,
    ),
  ],
  solver: party(undefined, { addresses: ["1GgupDpwzT3P8BxZ8g4feeapFin5Kx1T4a"] }),
});
