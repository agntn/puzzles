import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/13`. */
export const b1000Puzzle13 = bitcoinPuzzle({
  id: "b1000/13",
  address: p2pkh("1Pie8JkxBT6MGPz9Nvi3fsPkr2D8q3GBc1", "f932d0188616c964416b91fb9cf76ba9790a921e"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("03aadaaab1db8d5d450b511789c37e7cfeb0eb8b3e61a57a34166c5edc9a4b869d"),
  key: hex("0000000000000000000000000000000000000000000000000000000000001460", 13).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFUspniiQZds",
  ),
  prize: 0.013,
  solvedAt: "2015-01-15 18:07:14",
  solveTime: 0,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.013,
    ),
    claim(
      "2686aca4a211031b75396dbb9baecadfc01a1534d8682c8eacd307ab2c8f47e0",
      "2015-01-15 18:07:14",
      0.013,
    ),
  ],
});
