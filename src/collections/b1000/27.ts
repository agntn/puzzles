import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/27`. */
export const b1000Puzzle27 = bitcoinPuzzle({
  id: "b1000/27",
  address: p2pkh("128z5d7nN7PkCuX5qoA4Ys6pmxUYnEy86k", "0c7aaf6caa7e5424b63d317f0f8f1f9fa40d5560"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("031a864bae3922f351f1b57cfdd827c25b7e093cb9c88a72c1cd893d9f90f44ece"),
  key: hex("0000000000000000000000000000000000000000000000000000000006ac3875", 27).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7wBBz2KJQdASx",
  ),
  prize: 0.027,
  solvedAt: "2015-01-15 22:15:25",
  solveTime: 14891,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.027,
    ),
    claim(
      "0eb5b5c103e68eb0931430e7786cf1b6962f9eed5a2cb5271d4dd1699b77e86f",
      "2015-01-15 22:15:25",
      0.027,
    ),
  ],
});
