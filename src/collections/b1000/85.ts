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

/** Puzzle `b1000/85`. */
export const b1000Puzzle85 = bitcoinPuzzle({
  id: "b1000/85",
  address: p2pkh("1Kh22PvXERd2xpTQk3ur6pPEqFeckCJfAr", "cd03c1e6268ce9b89e3c3eeab8d0f1b6e8cac281"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("0329c4574a4fd8c810b7e42a4b398882b381bcd85e40c6883712912d167c83e73a"),
  key: hex("00000000000000000000000000000000000000000011720c4f018d51b8cebba8", 85).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZkCnRjpBspr8M5K8YnUtDNa",
  ),
  prize: 0.85,
  solvedAt: "2019-06-17 00:09:39",
  solveTime: 139384945,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.085,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.765,
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
      "bb26e67de6f1b67de29155b6fcd51aa459382803d9b3142091b0373abccc9f81",
      "2019-06-17 00:09:39",
      0.85,
    ),
  ],
});
