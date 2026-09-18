import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/32`. */
export const b1000Puzzle32 = bitcoinPuzzle({
  id: "b1000/32",
  address: p2pkh("1FRoHA9xewq7DjrZ1psWJVeTer8gHRqEvR", "9e42601eeaedc244e15f17375adb0e2cd08efdc9"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("0209c58240e50e3ba3f833c82655e8725c037a2294e14cf5d73a5df8d56159de69"),
  key: hex("00000000000000000000000000000000000000000000000000000000b862a62e", 32).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9MACNivtz8yMYTd",
  ),
  prize: 0.032,
  solvedAt: "2015-01-16 04:57:19",
  solveTime: 39005,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.032,
    ),
    claim(
      "919f5c226b8926d2203c6e1995738b7223b157740cb5c0fd33399860ded9866b",
      "2015-01-16 04:57:19",
      0.032,
    ),
  ],
});
