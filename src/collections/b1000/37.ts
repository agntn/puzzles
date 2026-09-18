import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/37`. */
export const b1000Puzzle37 = bitcoinPuzzle({
  id: "b1000/37",
  address: p2pkh("14iXhn8bGajVWegZHJ18vJLHhntcpL4dex", "28c30fb9118ed1da72e7c4f89c0164756e8a021d"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("027d2c03c3ef0aec70f2c7e1e75454a5dfdd0e1adea670c1b3a4643c48ad0f1255"),
  key: hex("0000000000000000000000000000000000000000000000000000001757756a93", 37).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9NRuiZFAX6XciCX",
  ),
  prize: 0.037,
  solvedAt: "2015-01-18 23:32:11",
  solveTime: 278697,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.037,
    ),
    claim(
      "21552e7e7e07498972ebf6e3ef56d7fc91dadbc7af32790e36ca2eeb4fd575c5",
      "2015-01-18 23:32:11",
      0.037,
    ),
  ],
});
