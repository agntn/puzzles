import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import {
  claim,
  compressed,
  funding,
  hex,
  increase,
  p2pkh,
  party,
  profile,
  pubkeyReveal,
} from "../../core/parts.ts";

/** Puzzle `b1000/120`. */
export const b1000Puzzle120 = bitcoinPuzzle({
  id: "b1000/120",
  address: p2pkh("17s2b9ksz5y7abUm92cHwG8jEPCzK3dLnT", "4b46e10a541aeec6be3fac709c256fb7da69308e"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("02ceb6cbbcdbdf5ef7150682150f4ce2c6f4807b349827dcdbdd1f2efa885a2630"),
  key: hex("0000000000000000000000000000000000b10f22572c497a836ea187f2e1fc23", 120).wif(
    "KwDiBf89QgGbjEhKnhXJuH7Lu5nahGjEQZB8k82itXNSb1Aa2Woh",
  ),
  prize: 1.2,
  solvedAt: "2023-02-27 09:40:55",
  solveTime: 256145621,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.12,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      1.08,
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
    claim(
      "9628d6d234b57075709a74215bfe2869b4d80b8ada11dd7be1030541ff8a0a53",
      "2023-02-27 09:40:55",
      1.2,
    ),
  ],
  solver: party("RetiredCoder", {
    addresses: ["3Emiwzxme7Mrj4d89uqohXNncnRM15YESs", "1Prestige1zSYorBdz94KA2UbJW3hYLTn4"],
    profiles: [
      profile("github", "https://github.com/RetiredC"),
      profile("bitcointalk", "https://bitcointalk.org/index.php?action=profile;u=3657819"),
    ],
  }),
});
