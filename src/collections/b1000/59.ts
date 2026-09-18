import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/59`. */
export const b1000Puzzle59 = bitcoinPuzzle({
  id: "b1000/59",
  address: p2pkh("1HAX2n9Uruu9YDt4cqRgYcvtGvZj1rbUyt", "b14ed3146f5b2c9bde1703deae9ef33af8110210"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("0241267d2d7ee1a8e76f8d1546d0d30aefb2892d231cee0dde7776daf9f8021485"),
  key: hex("00000000000000000000000000000000000000000000000007496cbb87cab44f", 59).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYkHpsTBP19HvTFqiU6i",
  ),
  prize: 0.59,
  solvedAt: "2019-02-11 22:39:32",
  solveTime: 128579538,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.059,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.531,
    ),
    claim(
      "66cd4fd4b240df28c5f61c4c86865f57e5f4e203dc8ea36d520e553e61d96e04",
      "2019-02-11 22:39:32",
      0.59,
    ),
  ],
});
