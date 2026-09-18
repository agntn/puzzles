import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, funding, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/99`. */
export const b1000Puzzle99 = bitcoinPuzzle({
  id: "b1000/99",
  address: p2pkh("1JWnE6p6UN7ZJBN7TtcbNDoRcjFtuDWoNL", "c01bf430a97cbcdaedddba87ef4ea21c456cebdb"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  key: bits(99),
  prize: 9.912573,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.099,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.891,
    ),
    increase(
      "cc3fb8769d4e928dab2f5ddbb65838ada2bc0d4e33cfd933d8a1a09fc4b6fa7e",
      "2022-12-13 23:51:04",
      0.00094933,
    ),
    increase(
      "17324bb2efbfa6826d6923f580751f28d8c5297f262a764e27d62bc4e9ba5b68",
      "2023-01-23 02:46:23",
      0.00189209,
    ),
    increase(
      "7de20a1b73abad37d2af5ced79297f33b38f724ef4477901765ddbfb740cc834",
      "2023-02-16 02:52:13",
      0.00069016,
    ),
    increase(
      "b425616ced3391587a8f778c36a949336c0717c62db71953a658bc16a8c7f748",
      "2023-02-16 13:39:42",
      0.0090418,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      8.91,
    ),
  ],
});
