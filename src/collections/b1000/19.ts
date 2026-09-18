import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/19`. */
export const b1000Puzzle19 = bitcoinPuzzle({
  id: "b1000/19",
  address: p2pkh("1NWmZRpHH4XSPwsW6dsS3nrNWfL1yrJj4w", "ebfbe6819fcdebab061732ce91df7d586a037dee"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("0385663c8b2f90659e1ccab201694f4f8ec24b3749cfe5030c7c3646a709408e19"),
  key: hex("000000000000000000000000000000000000000000000000000000000005749f", 19).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rGP2jMrxCfX3",
  ),
  prize: 0.019,
  solvedAt: "2015-01-15 18:07:14",
  solveTime: 0,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.019,
    ),
    claim(
      "ea746998394eafff179098d4df6a9c7caf79b2583a316ac0948276edfc58ba43",
      "2015-01-15 18:07:14",
      0.019,
    ),
  ],
});
