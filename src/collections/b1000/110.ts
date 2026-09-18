import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import {
  claim,
  compressed,
  funding,
  hex,
  increase,
  p2pkh,
  pubkeyReveal,
} from "../../core/parts.ts";

/** Puzzle `b1000/110`. */
export const b1000Puzzle110 = bitcoinPuzzle({
  id: "b1000/110",
  address: p2pkh("12JzYkkN76xkwvcPT6AWKZtGX6w2LAgsJg", "0e5f3c406397442996825fd395543514fd06f207"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("0309976ba5570966bf889196b7fdf5a0f9a1e9ab340556ec29f8bb60599616167d"),
  key: hex("00000000000000000000000000000000000035c0d7234df7deb0f20cf7062444", 110).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrctLcZtumiizzSmSckgpxQu6ieu6",
  ),
  prize: 1.1,
  solvedAt: "2020-05-30 20:04:06",
  solveTime: 169523812,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.11,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.99,
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
      "ed53ace1d284e1b9c5b2058fd296ee7d5be43efd6ce87d0a03adfe039c171e28",
      "2019-10-31 00:45:03",
      0.000007,
    ),
    increase(
      "03217c5fa3ab110901d53c998d8ea67e6d9b57f957815a9bd973c7d7fb7ed0f0",
      "2019-11-11 19:37:03",
      0.00000997,
    ),
    increase(
      "b0a92ea5ae2a58bdf7c6252edc10e6a5a0f1cc4a05455792e4984ca84d2607f4",
      "2019-11-11 20:54:30",
      0.00001636,
    ),
    claim(
      "8978a26d73ed11fec60d88f5cdb5f6d762c8e4fdb1dcae924ba5b06eb7fda456",
      "2020-05-30 20:04:06",
      1.10003333,
    ),
  ],
});
