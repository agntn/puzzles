import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/58`. */
export const b1000Puzzle58 = bitcoinPuzzle({
  id: "b1000/58",
  address: p2pkh("1Dn8NF8qDyyfHMktmuoQLGyjWmZXgvosXf", "8c2a6071f89c90c4dab5ab295d7729d1b54ea60f"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("0311569442e870326ceec0de24eb5478c19e146ecd9d15e4666440f2f638875f42"),
  key: hex("00000000000000000000000000000000000000000000000002c675b852189a21", 58).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjv2kTamEYQT9BNC7o1",
  ),
  prize: 0.58,
  solvedAt: "2018-12-03 06:03:22",
  solveTime: 122471768,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.058,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.522,
    ),
    claim(
      "17d31de2bd300bc1bad430ec0db77ca27466bbb97bf03df6a3ff386d60e58996",
      "2018-12-03 06:03:22",
      0.58,
    ),
  ],
});
