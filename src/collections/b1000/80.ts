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

/** Puzzle `b1000/80`. */
export const b1000Puzzle80 = bitcoinPuzzle({
  id: "b1000/80",
  address: p2pkh("1BCf6rHUW6m3iH2ptsvnjgLruAiPQQepLe", "6fe5a36eef0684af0b91f3b6cfc972d68c4f6fab"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("037e1238f7b1ce757df94faa9a2eb261bf0aeb9f84dbf81212104e78931c2a19dc"),
  key: hex("00000000000000000000000000000000000000000000ea1a5c66dcc11b5ad180", 80).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZiAPRB6KvN7FnKsw69PP7vW",
  ),
  prize: 0.8,
  solvedAt: "2019-06-11 11:08:53",
  solveTime: 138906099,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.08,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.72,
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
      "bb05d206d64e20c706a7da14cd49b4f80d0c92995db193428ebda753e578ce79",
      "2019-06-11 11:08:53",
      0.8,
    ),
  ],
});
