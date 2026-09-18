import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/64`. */
export const b1000Puzzle64 = bitcoinPuzzle({
  id: "b1000/64",
  address: p2pkh("16jY7qLJnxb7CHZyqBP8qca9d51gAjyXQN", "3ee4133d991f52fdf6a25c9834e0745ac74248a4"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("03100611c54dfef604163b8358f7b7fac13ce478e02cb224ae16d45526b25d9d4d"),
  key: hex("000000000000000000000000000000000000000000000000f7051f27b09112d4", 64).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qZ6FxoaD5r1kYegmtbaT",
  ),
  prize: 0.64,
  solvedAt: "2022-09-09 22:49:03",
  solveTime: 241418509,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.064,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.576,
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
    increase(
      "ed53ace1d284e1b9c5b2058fd296ee7d5be43efd6ce87d0a03adfe039c171e28",
      "2019-10-31 00:45:03",
      0.00000564,
    ),
    increase(
      "5815ecc9699c32adbfc77e2f7bd0e35c87e3ffeacd248cac7eb35452b49d508d",
      "2020-11-23 03:00:39",
      0.00001,
    ),
    increase(
      "e6e7ee7bcb9a9b616121faa56cdd6e8a1d9c5fd93a67b41c93c705d396b8ea26",
      "2020-12-08 18:48:04",
      0.00012,
    ),
    increase(
      "776b63fc5506eb23ec7aec5b89db0c51c228a3c592939af1a6f802faa97f5d13",
      "2020-12-20 05:03:18",
      0.00001,
    ),
    increase(
      "7696793c052f4ed3362a0036f8cb7aa11302c134f2e4af2eae933af54809969c",
      "2021-05-07 22:44:07",
      0.00002021,
    ),
    increase(
      "8058cbfcbe89688aaac3a48c65f461a3efa5e09c536b4c4211b4030f311588b3",
      "2021-08-29 11:30:32",
      0.00002,
    ),
    increase(
      "5ba85ff53e1c4816d96490d9b4ff06cd8b07751298a846e7579131c5973d348b",
      "2022-02-22 11:26:14",
      0.00000696,
    ),
    increase(
      "07af703e54e326116144536a2da7fe732224cb07de96d99be9031b443e74a619",
      "2022-03-31 20:58:56",
      0.0000101,
    ),
    increase(
      "294e3134d6fbb970131236ca947965b23b5bfb8e1e5eeb070b567f06a903f4e3",
      "2022-05-17 19:19:30",
      0.00000642,
    ),
    increase(
      "a63f1b15dd736529b29f92b443bf401c41d190403923f8fc913d377c2acea1c4",
      "2022-06-01 00:14:56",
      0.00010026,
    ),
    claim(
      "9c1d797c34e3b04f9b721bac45fe3a410393bdd25d169bc62dcbca46b069fa9f",
      "2022-09-09 22:49:03",
      0.64032959,
    ),
  ],
});
