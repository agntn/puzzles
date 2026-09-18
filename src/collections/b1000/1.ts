import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/1`. */
export const b1000Puzzle1 = bitcoinPuzzle({
  id: "b1000/1",
  address: p2pkh("1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH", "751e76e8199196d454941c45d1b3a323f1433bd6"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2013-01-09 11:59:15",
  status: Status.Solved,
  pubkey: compressed("0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
  key: hex("0000000000000000000000000000000000000000000000000000000000000001", 1).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn",
  ),
  prize: 0.001,
  solvedAt: "2013-01-10 02:54:44",
  solveTime: 53729,
  preGenesis: true,
  transactions: [
    funding(
      "9223da07e858c6f153fbb8a24db52374ca19d2639098207c71710610cfda808e",
      "2013-01-09 11:59:15",
      0.03,
    ),
    claim(
      "3da9b8e4a9c056b22d4fd09784402fd1caab1ecf621ba074efc20dc03ff04277",
      "2013-01-10 02:54:44",
      0.03,
    ),
  ],
});
