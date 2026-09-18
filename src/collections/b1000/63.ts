import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/63`. */
export const b1000Puzzle63 = bitcoinPuzzle({
  id: "b1000/63",
  address: p2pkh("1NpYjtLira16LfGbGwZJ5JbDPh3ai9bjf4", "ef58afb697b094423ce90721fbb19a359ef7c50e"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("0365ec2994b8cc0a20d40dd69edfe55ca32a54bcbbaa6b0ddcff36049301a54579"),
  key: hex("0000000000000000000000000000000000000000000000007cce5efdaccf6808", 63).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYv5Z9J7hv7VYYN3XL3Y",
  ),
  prize: 0.63,
  solvedAt: "2019-07-12 12:26:39",
  solveTime: 141589165,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.063,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.567,
    ),
    increase(
      "5738c12f1c607609b6a33b870981c79d67bbbe4e43bfdf0799f7efd5d866aac2",
      "2019-06-20 19:31:16",
      0.00001,
    ),
    increase(
      "c725a765997cf82ca4a40cb2166f9ed2c2677e9ad9446112dd94920db7034a07",
      "2019-06-20 20:49:30",
      0.00001,
    ),
    increase(
      "9623ca8da4f10db5ca90a0673674571a3150e568cb82c2e2ad6ca55af77a67f9",
      "2019-06-20 21:20:44",
      0.00001,
    ),
    claim(
      "195876f004cb9cfa4ff22f4d3df94feda86c5a481fde6979889ea568ac2ca4ac",
      "2019-07-12 12:26:39",
      0.63003,
    ),
  ],
});
