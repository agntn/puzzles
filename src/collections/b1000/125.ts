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

/** Puzzle `b1000/125`. */
export const b1000Puzzle125 = bitcoinPuzzle({
  id: "b1000/125",
  address: p2pkh("1PXAyUB8ZoH3WD8n5zoAthYjN15yN5CVq5", "f7079256aa027dc437cbb539f955472416725fc8"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("0233709eb11e0d4439a729f21c2c443dedb727528229713f0065721ba8fa46f00e"),
  key: hex("000000000000000000000000000000001c533b6bb7f0804e09960225e44877ac", 125).wif(
    "KwDiBf89QgGbjEhKnhXJuH7Nbdz1FhKePEPcr4to6PqoSc6KxQy6",
  ),
  prize: 12.5,
  solvedAt: "2023-07-09 10:24:07",
  solveTime: 267553013,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.125,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      1.125,
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
      11.25,
    ),
    claim(
      "25427dc1fa67f259601750d5fbb98427a51d8b319d179557030ff3c4cb66af7e",
      "2023-07-09 10:24:07",
      12.5,
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
