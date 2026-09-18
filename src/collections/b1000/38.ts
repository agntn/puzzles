import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/38`. */
export const b1000Puzzle38 = bitcoinPuzzle({
  id: "b1000/38",
  address: p2pkh("1HBtApAFA9B2YZw3G2YKSMCtb3dVnjuNe2", "b190e2d40cfdeee2cee072954a2be89e7ba39364"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("03c060e1e3771cbeccb38e119c2414702f3f5181a89652538851d2e3886bdd70c6"),
  key: hex("00000000000000000000000000000000000000000000000000000022382facd0", 38).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9P3MahktLW5315v",
  ),
  prize: 0.038,
  solvedAt: "2015-01-19 10:27:27",
  solveTime: 318013,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.038,
    ),
    claim(
      "3def611be07c9e5866c9cf293fcb52ca132e56abcd8fa19130bd7a8d5d4b7c28",
      "2015-01-19 10:27:27",
      0.038,
    ),
  ],
});
