import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/23`. */
export const b1000Puzzle23 = bitcoinPuzzle({
  id: "b1000/23",
  address: p2pkh("1L2GM8eE7mJWLdo3HZS6su1832NX2txaac", "d0a79df189fe1ad5c306cc70497b358415da579e"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("03f82710361b8b81bdedb16994f30c80db522450a93e8e87eeb07f7903cf28d04b"),
  key: hex("0000000000000000000000000000000000000000000000000000000000556e52", 23).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rVkthFNsQ6i7",
  ),
  prize: 0.023,
  solvedAt: "2015-01-15 19:11:31",
  solveTime: 3857,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.023,
    ),
    claim(
      "cfbfafab6e04041ad36fb2395c2dd384f943ebdf61910c799f8f4a87276b2914",
      "2015-01-15 19:11:31",
      0.023,
    ),
  ],
});
