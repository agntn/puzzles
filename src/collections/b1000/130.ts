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

/** Puzzle `b1000/130`. */
export const b1000Puzzle130 = bitcoinPuzzle({
  id: "b1000/130",
  address: p2pkh("1Fo65aKq8s8iquMt6weF1rku1moWVEd5Ua", "a24922852051a9002ebf4c864a55acb75bb4cf75"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("03633cbe3ec02b9401c5effa144c5b4d22f87940259634858fc7e59b1c09937852"),
  key: hex("000000000000000000000000000000033e7665705359f04f28b88cf897c603c9", 130).wif(
    "KwDiBf89QgGbjEhKnhXJuH8DvUBxVmJ3761ahfZuohBr53Zh9M3t",
  ),
  prize: 13,
  solvedAt: "2024-09-23 08:13:37",
  solveTime: 305733983,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.13,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      1.17,
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
      11.7,
    ),
    increase(
      "6fc3dd6147c26e6458a04de586e24330c70b320ec31a67e968ca3eb2f8d5cc70",
      "2023-12-23 00:22:51",
      0.00006,
    ),
    claim(
      "91ec88f5d6d6cc727e0205d3aa3709fee507df05140d187846cf22aef784621a",
      "2024-09-23 08:13:37",
      13.00006,
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
