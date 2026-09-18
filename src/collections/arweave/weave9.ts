import { ethereumPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, standard } from "../../core/parts.ts";

/** Puzzle `arweave/weave9`. */
export const arweavePuzzleWeave9 = ethereumPuzzle({
  id: "arweave/weave9",
  address: standard("0x6f85d220c70abb69a1205b96b566c1ed5d9c3831"),
  sourceUrl: "https://arweave.net/1--NRFY3naNwTlxBSRjzDPNUq-Cn1yLG2RmgGHZem9c",
  startedAt: "2020-01-08 11:15:41",
  status: Status.Claimed,
  prize: 100,
  currency: "DAI",
  solvedAt: "2020-06-08 06:36:33",
  solveTime: 13116052,
  transactions: [
    funding(
      "0x3f2a623857ca0378d14075256d7def3ec5cfffa435a05c3bbd7cbc14e5587ae8",
      "2020-01-08 11:15:41",
      100,
    ),
    claim(
      "0x91968c60519866e1a982177ffca22d60520904e53ae6d11814fbc501ad0289bd",
      "2020-06-08 06:36:33",
      100,
    ),
  ],
});
