import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, increase, p2pkh, party } from "../../core/parts.ts";

/** Puzzle `b1000/67`. */
export const b1000Puzzle67 = bitcoinPuzzle({
  id: "b1000/67",
  address: p2pkh("1BY8GQbnueYofwSuFAT3USAhGjPrkxDdW9", "739437bb3dd6d1983e66629c5f08c70e52769371"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("0212209f5ec514a1580a2937bd833979d933199fc230e204c6cdc58872b7d46f75"),
  key: hex("00000000000000000000000000000000000000000000000730fc235c1942c1ae", 67).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qbP2K5cm35XKMND1X1KW",
  ),
  prize: 6.7,
  solvedAt: "2025-02-21 01:41:01",
  solveTime: 318756827,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.067,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.603,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      6.03,
    ),
    increase(
      "63da7a056b214b7de07511366662a889cc916dde2b7421fc4606bc1ed63e6fc6",
      "2023-09-25 15:00:17",
      0.00003769,
    ),
    increase(
      "55571ca5e1f86c11a5ec5837aa1edf4262042b4b18379373585047ce8f8938cf",
      "2024-05-12 00:07:46",
      0.00000546,
    ),
    increase(
      "69888f5e55d414b8de65f3a9307a1f414d7035cf9142239045300ce018984bd4",
      "2024-09-24 16:44:24",
      0.00003703,
    ),
    increase(
      "ee5bf15d6e65f87353d46cd084b4f3052d8315c6a157ef757acff58f8b5b2429",
      "2024-10-17 00:54:49",
      0.00002,
    ),
    increase(
      "d26e3fdad584be13a085094c0668a61f84326a5f9ec316baaf2ce7931b8a8863",
      "2024-10-21 01:11:34",
      0.00000678,
    ),
    increase(
      "22e955db5c02e10f89045df063af7c320b8e813916cb974d4452fd5eed57687a",
      "2025-01-28 07:27:07",
      0.000006,
    ),
    increase(
      "354a780bb64d0c953262389833531c32e45a6e041fddff43babf0f7360c7adfb",
      "2025-02-05 09:09:28",
      0.00000398,
    ),
    increase(
      "d528fad306f89d7e2cafc8474dc9c1579bd4ae2f9a4f3f19c7a30fef6410d5b4",
      "2025-02-11 14:13:02",
      0.00000547,
    ),
    increase(
      "222f724a59f4bb8e3d6ed81bf07a13a65bed21b2d33843d2654e221bdba8f7ce",
      "2025-02-11 14:20:07",
      0.00001,
    ),
    claim(
      "0be77ec8bec331da8750c8b715085c6cf6c374ca31f829a515c62b9846e32986",
      "2025-02-21 01:41:01",
      6.70013241,
    ),
  ],
  solver: party(undefined, { addresses: ["bc1qfk357t8n045f8mwx672rx2re4pftm5gmjzdwq7"] }),
});
