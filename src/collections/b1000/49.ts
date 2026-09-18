import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/49`. */
export const b1000Puzzle49 = bitcoinPuzzle({
  id: "b1000/49",
  address: p2pkh("12CiUhYVTTH33w3SPUBqcpMoqnApAV4WCF", "0d2f533966c6578e1111978ca698f8add7fffdf3"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("02591d682c3da4a2a698633bf5751738b67c343285ebdc3492645cb44658911484"),
  key: hex("000000000000000000000000000000000000000000000000000174176b015f4d", 49).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgejcjwprJ4MAYLw8e",
  ),
  prize: 0.049,
  solvedAt: "2015-09-01 20:20:24",
  solveTime: 19793590,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.049,
    ),
    claim(
      "39553513f731ae20f98f3307e863f0aecee9842f22273bb2ddfc0fb6ba481c5e",
      "2015-09-01 20:20:24",
      0.049,
    ),
  ],
});
