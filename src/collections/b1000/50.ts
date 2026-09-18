import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/50`. */
export const b1000Puzzle50 = bitcoinPuzzle({
  id: "b1000/50",
  address: p2pkh("1MEzite4ReNuWaL5Ds17ePKt2dCxWEofwk", "de081b76f840e462fa2cdf360173dfaf4a976a47"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("03f46f41027bbf44fafd6b059091b900dad41e6845b2241dc3254c7cdd3c5a16c6"),
  key: hex("00000000000000000000000000000000000000000000000000022bd43c2e9354", 50).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgfXBMYdNVA4EjUMzg",
  ),
  prize: 0.05,
  solvedAt: "2015-09-01 20:20:24",
  solveTime: 19793590,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.05,
    ),
    claim(
      "39553513f731ae20f98f3307e863f0aecee9842f22273bb2ddfc0fb6ba481c5e",
      "2015-09-01 20:20:24",
      0.05,
    ),
  ],
});
