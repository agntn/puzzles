import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/55`. */
export const b1000Puzzle55 = bitcoinPuzzle({
  id: "b1000/55",
  address: p2pkh("1LzhS3k3e9Ub8i2W1V8xQFdB8n2MYCHPCa", "db53d9bbd1f3a83b094eeca7dd970bd85b492fa2"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("0385a30d8413af4f8f9e6312400f2d194fe14f02e719b24c3f83bf1fd233a8f963"),
  key: hex("000000000000000000000000000000000000000000000000006abe1f9b67e114", 55).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjidyYKE5NcJQZYvknA",
  ),
  prize: 0.55,
  solvedAt: "2018-05-29 08:13:52",
  solveTime: 106236398,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.055,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.495,
    ),
    increase(
      "0cec4460b09db31a00ff1475c32b6a02a89fde2ff89d8ff8fd79535a21474d90",
      "2018-03-11 04:50:13",
      0.00011515,
    ),
    claim(
      "ecc8c09284a6f9e6d52cccf7f8f4aef1d0c4a33984375dea4cea70923066078d",
      "2018-05-29 08:13:52",
      0.55011515,
    ),
  ],
});
