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

/** Puzzle `b1000/75`. */
export const b1000Puzzle75 = bitcoinPuzzle({
  id: "b1000/75",
  address: p2pkh("1J36UjUByGroXcCvmj13U6uwaVv9caEeAt", "badf8b0d34289e679ec65c6c61d3a974353be5cf"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("03726b574f193e374686d8e12bc6e4142adeb06770e0a2856f5e4ad89f66044755"),
  key: hex("0000000000000000000000000000000000000000000004c5ce114686a1336e07", 75).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3yHuxB7NfERRuDTNy2kbr",
  ),
  prize: 0.75,
  solvedAt: "2019-06-10 21:05:57",
  solveTime: 138855523,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.075,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.675,
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
      "e1a5d5ac5db02801828ec79e6c94fa724525eaa0f6f7fd303dc14a1e9d0f4c64",
      "2019-06-10 21:05:57",
      0.75,
    ),
  ],
});
