import { arweavePuzzle } from "../../core/puzzle.ts";
import { funding, standard } from "../../core/parts.ts";

/** Puzzle `arweave/weave10`. */
export const arweavePuzzleWeave10 = arweavePuzzle({
  id: "arweave/weave10",
  address: standard("bkjJGw3NLxs8OAyRxgTL-QFpiB3lBJqZ76kDhWdB-Rs"),
  sourceUrl: "https://arweave.net/1fLPMP_smP6ipdIYbYUAZtFPwO4crdYr4kMVf5uTivg",
  startedAt: "2020-04-14 09:17:16",
  prize: 500,
  transactions: [
    funding("uurk6fxEsygKJmr-fJyC-3sPneslNV3ZtUx0fZxZAG0", "2020-04-14 09:17:16", 500),
  ],
});
