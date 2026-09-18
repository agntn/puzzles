import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/28`. */
export const b1000Puzzle28 = bitcoinPuzzle({
  id: "b1000/28",
  address: p2pkh("12jbtzBb54r97TCwW3G1gCFoumpckRAPdY", "1306b9e4ff56513a476841bac7ba48d69516b1da"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("03e9e661838a96a65331637e2a3e948dc0756e5009e7cb5c36664d9b72dd18c0a7"),
  key: hex("000000000000000000000000000000000000000000000000000000000d916ce8", 28).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M82GSgY8p5EkUe",
  ),
  prize: 0.028,
  solvedAt: "2015-01-15 22:15:25",
  solveTime: 14891,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.028,
    ),
    claim(
      "0eb5b5c103e68eb0931430e7786cf1b6962f9eed5a2cb5271d4dd1699b77e86f",
      "2015-01-15 22:15:25",
      0.028,
    ),
  ],
});
