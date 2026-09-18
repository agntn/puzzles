import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/11`. */
export const b1000Puzzle11 = bitcoinPuzzle({
  id: "b1000/11",
  address: p2pkh("1PgQVLmst3Z314JrQn5TNiys8Hc38TcXJu", "f8c698da3164ef8fa4258692d118cc9a902c5acc"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("038b05b0603abd75b0c57489e451f811e1afe54a8715045cdf4888333f3ebc6e8b"),
  key: hex("0000000000000000000000000000000000000000000000000000000000000483", 11).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFUGxXgtm63M",
  ),
  prize: 0.011,
  solvedAt: "2015-01-15 18:07:14",
  solveTime: 0,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.011,
    ),
    claim(
      "5c2f4fc31a359f72a363488496365eff2e8eed1b59e4e6dc240d5b8dfa740376",
      "2015-01-15 18:07:14",
      0.011,
    ),
  ],
});
