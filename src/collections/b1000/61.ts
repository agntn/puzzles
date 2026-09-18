import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/61`. */
export const b1000Puzzle61 = bitcoinPuzzle({
  id: "b1000/61",
  address: p2pkh("1AVJKwzs9AskraJLGHAZPiaZcrpDr1U6AB", "68133e19b2dfb9034edf9830a200cfdf38c90cbd"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("0249a43860d115143c35c09454863d6f82a95e47c1162fb9b2ebe0186eb26f453f"),
  key: hex("00000000000000000000000000000000000000000000000013c96a3742f64906", 61).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYmLDHsih379uP9zbHSD",
  ),
  prize: 0.61,
  solvedAt: "2019-05-11 12:53:18",
  solveTime: 136233964,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.061,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.549,
    ),
    increase(
      "cdae2da8fe4b18dc264e568a29e804f2b32529b8018a9d28e271ac7e9077c718",
      "2019-02-24 21:48:34",
      0.00000793,
    ),
    claim(
      "481d2b7ceb253520336fbbe681126ae58d14ecd552320d88203b2e806e76358d",
      "2019-05-11 12:53:18",
      0.61,
    ),
  ],
});
