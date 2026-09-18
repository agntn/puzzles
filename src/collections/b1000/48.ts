import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/48`. */
export const b1000Puzzle48 = bitcoinPuzzle({
  id: "b1000/48",
  address: p2pkh("1DFYhaB2J9q1LLZJWKTnscPWos9VBqDHzv", "8661cb56d9df0a61f01328b55af7e56a3fe7a2b2"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("0291bee5cf4b14c291c650732faa166040e4c18a14731f9a930c1e87d3ec12debb"),
  key: hex("0000000000000000000000000000000000000000000000000000ade6d7ce3b9b", 48).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgdtUGWxHzvDi28MfR",
  ),
  prize: 0.048,
  solvedAt: "2015-09-01 20:20:24",
  solveTime: 19793590,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.048,
    ),
    claim(
      "39553513f731ae20f98f3307e863f0aecee9842f22273bb2ddfc0fb6ba481c5e",
      "2015-09-01 20:20:24",
      0.048,
    ),
  ],
});
