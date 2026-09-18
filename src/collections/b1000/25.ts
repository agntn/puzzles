import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/25`. */
export const b1000Puzzle25 = bitcoinPuzzle({
  id: "b1000/25",
  address: p2pkh("15JhYXn6Mx3oF4Y7PcTAv2wVVAuCFFQNiP", "2f396b29b27324300d0c59b17c3abc1835bd3dbb"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("03057fbea3a2623382628dde556b2a0698e32428d3cd225f3bd034dca82dd7455a"),
  key: hex("0000000000000000000000000000000000000000000000000000000001fa5ee5", 25).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7siAXycwkwRQg",
  ),
  prize: 0.025,
  solvedAt: "2015-01-15 22:15:25",
  solveTime: 14891,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.025,
    ),
    claim(
      "0eb5b5c103e68eb0931430e7786cf1b6962f9eed5a2cb5271d4dd1699b77e86f",
      "2015-01-15 22:15:25",
      0.025,
    ),
  ],
});
