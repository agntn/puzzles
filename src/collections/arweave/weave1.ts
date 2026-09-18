import { arweavePuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, party, standard } from "../../core/parts.ts";

/** Puzzle `arweave/weave1`. */
export const arweavePuzzleWeave1 = arweavePuzzle({
  id: "arweave/weave1",
  address: standard("PbdTDYikdddWfNFlDt2aZokALXKe1mJVSC9TALUBNv8"),
  sourceUrl: "https://arweave.net/byT7l6tkFq8mzqshwmju8fVi1rp8H9mYanlxzsJ7RjQ#instructions",
  startedAt: "2019-05-22 10:27:23",
  status: Status.Claimed,
  prize: 1000,
  solvedAt: "2019-05-23 19:53:50",
  solveTime: 120387,
  transactions: [
    funding("Yd0DrtrEzTg3K9HCxQY5fKgnng4S9ShH2WYmObFTLmo", "2019-05-22 10:27:23", 500),
    funding("KZac9xX660vJQmymsawId_pdM-oJjBYIlCSVE__Vq7w", "2019-05-23 15:13:40", 500),
    claim("BYZEa-jS5pfY-dakErCemga4fkM-mjBDEONW0IzcYAs", "2019-05-23 19:53:50", 999.99978588),
  ],
  solver: party("pogo"),
});
