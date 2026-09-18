import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, increase, p2pkh, party } from "../../core/parts.ts";

/** Puzzle `b1000/68`. */
export const b1000Puzzle68 = bitcoinPuzzle({
  id: "b1000/68",
  address: p2pkh("1MVDYgVaSN6iKKEsbzRUAYFrYJadLYZvvZ", "e0b8a2baee1b77fc703455f39d51477451fc8cfc"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("031fe02f1d740637a7127cdfe8a77a8a0cfc6435f85e7ec3282cb6243c0a93ba1b"),
  key: hex("00000000000000000000000000000000000000000000000bebb3940cd0fc1491", 68).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qd7sDG4F2sdMtzNe8y2U",
  ),
  prize: 6.8,
  solvedAt: "2025-04-06 22:52:42",
  solveTime: 322634728,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.068,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.612,
    ),
    increase(
      "65264bade4a3cf484d649b058a6482fc66bbf3b710d342c83fdf311e97567b05",
      "2023-03-26 00:46:41",
      0.00001,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      6.12,
    ),
    increase(
      "e2d8d24e4ce591bebc0dd92c55596d4e6f21e38ce4118de9625cad351a732ce5",
      "2023-09-25 15:00:17",
      0.00003768,
    ),
    increase(
      "55571ca5e1f86c11a5ec5837aa1edf4262042b4b18379373585047ce8f8938cf",
      "2024-05-12 00:07:46",
      0.00000546,
    ),
    increase(
      "82663b99c18c61a81515342df76ad42560d9c3a91bdc5695830a114c874e94b1",
      "2025-01-28 07:26:42",
      0.000006,
    ),
    increase(
      "d8ac1247594800c6de2cf8fe72bf0a8431016af708a741b46c753a16c9a855b3",
      "2025-02-04 12:20:30",
      0.00001,
    ),
    increase(
      "2ae40c9480cd4608754636bf14ae0b978e589b59f38f9e48a21f03bd084ce622",
      "2025-03-06 21:44:48",
      1e-8,
    ),
    increase(
      "6907f589ffc4eb2889f154c292c3ae54cb046b395066485d6d598dddd88e38d0",
      "2025-03-07 06:51:25",
      0.000022,
    ),
    increase(
      "5be41d92b4a9829e2555cf7389dfc8f62209a1ff7f60bae5634518f5287d881f",
      "2025-03-16 03:24:47",
      1e-8,
    ),
    increase(
      "42cfb3573cdb540cffdca9376802234bf04e843c1dfaae9a877447c57626e286",
      "2025-03-22 03:10:27",
      0.00000833,
    ),
    increase(
      "0f58191b0bedc574e0ca12026f66066f6a919aa4687d7216b89812ca64eaa5bb",
      "2025-03-28 20:09:27",
      0.000008,
    ),
    increase(
      "0e0fe0335638be35190b4b251d2ae67579feb5a14774cbcd4180b40b9a793a3c",
      "2025-03-29 01:18:50",
      0.00000666,
    ),
    increase(
      "aff11a074048fba3b545f1498d0b0d32dd2f2309864deb4550d4dd29727324b4",
      "2025-03-29 11:13:43",
      0.00000775,
    ),
    increase(
      "017cfc42405a2dae6417b9137e452268f1d936ef7410c1b5e387dee755387edb",
      "2025-03-29 16:41:47",
      0.00000647,
    ),
    increase(
      "e3b4d2f6971099039b7b47869bdc2217fc37119bf98fbe2e44be85cc29c133c1",
      "2025-03-30 00:50:59",
      0.00000775,
    ),
    increase(
      "4328caeff6a8679a6a64e9b835d3c08ab26554c4b89042c77581f7a6904f0eb9",
      "2025-03-30 01:23:03",
      0.00000783,
    ),
    increase(
      "47e20f8b984c3bf2740ab724204d3fe74ce8f1fc68f0060967ef7d94e0e16504",
      "2025-03-30 01:23:03",
      0.00000771,
    ),
    increase(
      "285a933772c91d5202225015ed6fc9f8a24f3140042a0893dead42ce140e4e14",
      "2025-04-03 06:38:53",
      1e-8,
    ),
    claim(
      "a5635eb2205bd3024e55156ee353110415829d1c6bc947f42bfa162488b0eb08",
      "2025-04-06 22:52:42",
      6.80015167,
    ),
  ],
  solver: party(undefined, { addresses: ["bc1qfwpccz2udt3efk7y2wt9l44h34cs5yevjc80lk"] }),
});
