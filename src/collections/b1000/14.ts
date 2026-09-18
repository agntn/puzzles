import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/14`. */
export const b1000Puzzle14 = bitcoinPuzzle({
  id: "b1000/14",
  address: p2pkh("1ErZWg5cFCe4Vw5BzgfzB74VNLaXEiEkhk", "97f9281a1383879d72ac52a6a3e9e8b9a4a4f655"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("03b4f1de58b8b41afe9fd4e5ffbdafaeab86c5db4769c15d6e6011ae7351e54759"),
  key: hex("0000000000000000000000000000000000000000000000000000000000002930", 14).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFVfZyiN5iEG",
  ),
  prize: 0.014,
  solvedAt: "2015-01-15 18:07:14",
  solveTime: 0,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.014,
    ),
    claim(
      "c0d88c38111f54c86e2f5f1921c8dedd6b8ca6052baf496010ab755dcece5b46",
      "2015-01-15 18:07:14",
      0.014,
    ),
  ],
});
