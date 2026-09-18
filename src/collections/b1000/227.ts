import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, p2pkh, sweep } from "../../core/parts.ts";

/** Puzzle `b1000/227`. */
export const b1000Puzzle227 = bitcoinPuzzle({
  id: "b1000/227",
  address: p2pkh("15a9nXpjnQzw2o5kmvGyKzv7anZkYFHwdK", "32259030b93d8f20268aaa2c5222f9366faa2fc3"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("02f73589feb03e8ed1de43cc7748111e2f1d73a2a06679951addeee165d378f23e"),
  key: bits(227),
  prize: 0.227,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.227,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.227,
    ),
  ],
});
