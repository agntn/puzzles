import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import {
  claim,
  compressed,
  fact,
  funding,
  hex,
  increase,
  p2pkh,
  party,
  PartyKind,
  profile,
  pubkeyReveal,
} from "../../core/parts.ts";

/** Puzzle `b1000/135`. */
export const b1000Puzzle135 = bitcoinPuzzle({
  id: "b1000/135",
  address: p2pkh("16RGFo6hjq9ym6Pj7N5H7L1NR1rVPJyw2v", "3b6f58a75a54bfd85d1bc6c51180fdc732992326"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("02145d2611c823a396ef6712ce0f712f09b9b4f3135e3e0aa3230fb9b6d08d1e16"),
  key: hex("0000000000000000000000000000006d9392a16883f90903d5f78da57af07eb2", 135).wif(
    "KwDiBf89QgGbjEhKnhXJuHd5nqdUrAnYX4EBqgA3Lxm2rHQuQMih",
  ),
  prize: 13.500034,
  solvedAt: "2026-07-28 08:20:16",
  solveTime: 363881582,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.135,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      1.215,
    ),
    increase(
      "7c432398c7631600af01695c9767eff109cbfae4f7ecccaff388043a474d4f1e",
      "2019-05-16 04:25:45",
      0.00001,
    ),
    pubkeyReveal(
      "17e4e323cfbc68d7f0071cad09364e8193eedf8fefbcbd8a21b4b65717a4b3d3",
      "2019-06-01 02:07:26",
      0.00001,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      12.15,
    ),
    increase(
      "e876a49f4f04d687b0b227bf554fbf1878289288291d17339413dd287af27c64",
      "2024-10-09 14:58:21",
      0.00002208,
    ),
    increase(
      "32ea2049816f4bc776a2152bff801a32582d75287d0d79b6b4388b5ba7527fb8",
      "2025-01-28 02:11:50",
      0.000006,
    ),
    increase(
      "3f2ec8791ec73c2216bf1dba98d79624c30bc9bf86abc314404eeec87d43f0c0",
      "2025-03-30 01:49:24",
      0.000006,
    ),
    claim(
      "817535430c600810080662dd425a2e335f771effd950d28fc443bce4a92fa812",
      "2026-07-28 08:20:16",
      13.5,
    ),
    claim(
      "840d3ed5183fd1309c364d5f5a71a9686e78b24ec2e8a502062fc5a9258a9ba7",
      "2026-07-29 19:35:34",
      0.00003408,
    ),
  ],
  solver: party("RetiredCoder", {
    key: "retired-coder",
    kind: PartyKind.Person,
    about:
      "Author of RCKangaroo, an open source Pollard kangaroo solver for Nvidia GPUs, who took four of the puzzle transaction's keys and then retired from the race.",
    addresses: ["3Emiwzxme7Mrj4d89uqohXNncnRM15YESs", "1Prestige1zSYorBdz94KA2UbJW3hYLTn4"],
    profiles: [
      profile("github", "https://github.com/RetiredC"),
      profile("bitcointalk", "https://bitcointalk.org/index.php?action=profile;u=3657819"),
    ],
    facts: [
      fact(
        "The GitHub profile says: I've solved 134-bit range point on Secp256k1 (Bitcoin challenges #120, #125, #130, #135). Probably, it's a world record.",
        "https://github.com/RetiredC",
      ),
      fact(
        "Publishes RCKangaroo, a CUDA implementation of Pollard's kangaroo method with symmetry that solves the discrete log in a known range.",
        "https://github.com/RetiredC/RCKangaroo",
      ),
      fact(
        "Announced #135 on bitcointalk: about 5 months on 200 GPUs, and I quit, officially.",
        "https://bitcointalk.org/index.php?topic=5517607.msg66986617#msg66986617",
        { date: "2026-07-28" },
      ),
      fact(
        "Released RCKangaroo v4.0 with the ASM turbo kernels the same day, calling its main loop without inversions the Triple Montgomery trick.",
        "https://bitcointalk.org/index.php?topic=5517607.msg66986810#msg66986810",
        { date: "2026-07-28" },
      ),
      fact(
        "Said the run paid, but never again: it was too boring to pay bills for five months.",
        "https://bitcointalk.org/index.php?topic=5517607.msg66987408#msg66987408",
        { date: "2026-07-28" },
      ),
    ],
  }),
});
