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

/** Puzzle `b1000/115`. */
export const b1000Puzzle115 = bitcoinPuzzle({
  id: "b1000/115",
  address: p2pkh("1NLbHuJebVwUZ1XqDjsAyfTRUPwDQbemfv", "ea0f2b7576bd098921fce9bfebe37f6383e639a4"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("0248d313b0398d4923cdca73b8cfa6532b91b96703902fc8b32fd438a3b7cd7f55"),
  key: hex("0000000000000000000000000000000000060f4d11574f5deee49961d9609ac6", 115).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrhcVkatbczm7Y9ZaB56U1jLNU2Xh",
  ),
  prize: 1.15,
  solvedAt: "2020-06-16 07:33:42",
  solveTime: 170947588,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.115,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      1.035,
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
      "15df42c8d957ca66700a7c6455da76c5d88ee847b47819447527f0985827b1ce",
      "2020-06-16 07:33:42",
      1.15,
    ),
  ],
});
