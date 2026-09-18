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

/** Puzzle `b1000/100`. */
export const b1000Puzzle100 = bitcoinPuzzle({
  id: "b1000/100",
  address: p2pkh("1KCgMv8fo2TPBpddVi9jqmMmcne9uSNJ5F", "c7a7b23f6bd98b8aaf527beb724dda9460b1bc6e"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("03d2063d40402f030d4cc71331468827aa41a8a09bd6fd801ba77fb64f8e67e617"),
  key: hex("000000000000000000000000000000000000000af55fc59c335c8ec67ed24826", 100).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciWJvjTPYdp4sSLwstc63avmfRA",
  ),
  prize: 1,
  solvedAt: "2019-07-08 04:57:04",
  solveTime: 141216590,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.1,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.9,
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
      "d4087636f7c54d382164e4cd9548a1bad6c603664268f74537b6aed8a6371704",
      "2019-07-08 04:57:04",
      1,
    ),
  ],
});
