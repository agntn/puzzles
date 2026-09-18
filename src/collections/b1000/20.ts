import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/20`. */
export const b1000Puzzle20 = bitcoinPuzzle({
  id: "b1000/20",
  address: p2pkh("1HsMJxNiV7TLxmoF6uJNkydxPFDog4NQum", "b907c3a2a3b27789dfb509b730dd47703c272868"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("033c4a45cbd643ff97d77f41ea37e843648d50fd894b864b0d52febc62f6454f7c"),
  key: hex("00000000000000000000000000000000000000000000000000000000000d2c55", 20).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rHfuE2Tg4nJW",
  ),
  prize: 0.02,
  solvedAt: "2015-01-15 18:07:14",
  solveTime: 0,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.02,
    ),
    claim(
      "3121aba5b7cc4d766a1e1b937c456d299bd75c6f3059c82353a4918b714d66c4",
      "2015-01-15 18:07:14",
      0.02,
    ),
  ],
});
