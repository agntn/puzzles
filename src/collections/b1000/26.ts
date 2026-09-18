import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/26`. */
export const b1000Puzzle26 = bitcoinPuzzle({
  id: "b1000/26",
  address: p2pkh("1JVnST957hGztonaWK6FougdtjxzHzRMMg", "bfebb73562d4541b32a02ba664d140b5a574792f"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("024e4f50a2a3eccdb368988ae37cd4b611697b26b29696e42e06d71368b4f3840f"),
  key: hex("000000000000000000000000000000000000000000000000000000000340326e", 26).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7tefTXkqGMNis",
  ),
  prize: 0.026,
  solvedAt: "2015-01-15 22:15:25",
  solveTime: 14891,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.026,
    ),
    claim(
      "0eb5b5c103e68eb0931430e7786cf1b6962f9eed5a2cb5271d4dd1699b77e86f",
      "2015-01-15 22:15:25",
      0.026,
    ),
  ],
});
