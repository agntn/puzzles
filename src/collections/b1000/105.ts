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

/** Puzzle `b1000/105`. */
export const b1000Puzzle105 = bitcoinPuzzle({
  id: "b1000/105",
  address: p2pkh("1CMjscKB3QW7SDyQ4c3C3DEUHiHRhiZVib", "7c957db6fdd0733bb83bc6d6d747711263ba50b0"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("03bcf7ce887ffca5e62c9cabbdb7ffa71dc183c52c04ff4ee5ee82e0c55c39d77b"),
  key: hex("000000000000000000000000000000000000016f14fc2054cd87ee6396b33df3", 105).wif(
    "KwDiBf89QgGbjEhKnhXJuH7Lrcim5eBMkFQwQtRbW6wxT1ajoNqE",
  ),
  prize: 1.05,
  solvedAt: "2019-09-23 01:29:47",
  solveTime: 147856953,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.105,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.945,
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
      "1f31aa69f56972c08e70da07c92903949fb0f4cd6b02462c1d0de81130113f14",
      "2019-09-23 01:29:47",
      1.05,
    ),
  ],
});
