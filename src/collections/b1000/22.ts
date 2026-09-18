import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/22`. */
export const b1000Puzzle22 = bitcoinPuzzle({
  id: "b1000/22",
  address: p2pkh("1CfZWK1QTQE3eS9qn61dQjV89KDjZzfNcv", "7ff45303774ef7a52fffd8011981034b258cb86b"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("023ed96b524db5ff4fe007ce730366052b7c511dc566227d929070b9ce917abb43"),
  key: hex("00000000000000000000000000000000000000000000000000000000002de40f", 22).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rP9Ja2dhtxoh",
  ),
  prize: 0.022,
  solvedAt: "2015-01-15 22:15:25",
  solveTime: 14891,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.022,
    ),
    claim(
      "0eb5b5c103e68eb0931430e7786cf1b6962f9eed5a2cb5271d4dd1699b77e86f",
      "2015-01-15 22:15:25",
      0.022,
    ),
  ],
});
