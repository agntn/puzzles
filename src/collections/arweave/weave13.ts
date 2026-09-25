import { ethereumPuzzle, Status } from "../../core/puzzle.ts";
import { claim, fact, funding, party, standard } from "../../core/parts.ts";

/** Puzzle `arweave/weave13`. */
export const arweavePuzzleWeave13 = ethereumPuzzle({
  id: "arweave/weave13",
  address: standard("0x0a5c81f5bfb8ec2f47deff466a1a4e55b8fc9319"),
  sourceUrl: "https://arweave.net/icRlgZbXVq01wPrFdllafMvKXoQ6Kfo1mQMdmeyX514",
  startedAt: "2020-05-18 23:53:09",
  status: Status.Claimed,
  prize: 1,
  solvedAt: "2020-05-23 01:26:15",
  solveTime: 351186,
  transactions: [
    funding(
      "0x7638cc1662742f6e3fa07e48d010744ae7c08c0a144d8efe8e8d961cee5a89ac",
      "2020-05-18 23:53:09",
      1,
    ),
    claim(
      "0x489ee0b07653ca91c52b3201b795f55824529c1acbfadeb088b9493db78e136e",
      "2020-05-23 01:26:15",
      1,
    ),
  ],
  solver: party("lefevre", {
    key: "lefevre",
    about:
      "Handle credited with Arweave Puzzle 13, an image puzzle worth 1 ETH, four days after it went up.",
    facts: [
      fact(
        "ZorenX's write-up of Puzzle 13 names lefevre as the solver: eight pictures identified, their labels hashed with SHA-256 into the key.",
        "https://medium.com/@zorenskye/arweave-puzzle-series-puzzle-13-solved-d770655f705b",
      ),
    ],
  }),
});
