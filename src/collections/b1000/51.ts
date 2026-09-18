import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/51`. */
export const b1000Puzzle51 = bitcoinPuzzle({
  id: "b1000/51",
  address: p2pkh("1NpnQyZ7x24ud82b7WiRNvPm6N8bqGQnaS", "ef6419cffd7fad7027994354eb8efae223c2dbe7"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("028c6c67bef9e9eebe6a513272e50c230f0f91ed560c37bc9b033241ff6c3be78f"),
  key: hex("00000000000000000000000000000000000000000000000000075070a1a009d4", 51).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgm9fa43QnU2CpULaK",
  ),
  prize: 0.051,
  solvedAt: "2017-04-05 10:11:20",
  solveTime: 70041846,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.051,
    ),
    claim(
      "70ee9ab241829a6f49ebf9f109e97f6e466d938e558bade1c5fe341310bc356e",
      "2017-04-05 10:11:20",
      0.051,
    ),
  ],
});
