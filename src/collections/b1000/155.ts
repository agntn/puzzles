import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, compressed, funding, increase, p2pkh, pubkeyReveal } from "../../core/parts.ts";

/** Puzzle `b1000/155`. */
export const b1000Puzzle155 = bitcoinPuzzle({
  id: "b1000/155",
  address: p2pkh("1AoeP37TmHdFh8uN72fu9AqgtLrUwcv2wJ", "6b8b7830f73c5bf9e8beb9f161ad82b3bde992e4"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  pubkey: compressed("035cd1854cae45391ca4ec428cc7e6c7d9984424b954209a8eea197b9e364c05f6"),
  key: bits(155),
  prize: 15.500116,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.155,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      1.395,
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
    increase(
      "e1f668b8cc9915fcd3de6ec922acf98cdf4c14f75de9530b6ad750693d44076b",
      "2021-08-19 15:55:55",
      0.00001,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      13.95,
    ),
    increase(
      "ddf0c3de51e34363c756e5850f4a2fc1b9af8dcb76a2d7f9e61cebc5526e95de",
      "2025-01-28 07:26:42",
      0.000006,
    ),
    increase(
      "21f8ff5f3bd280004239e4b0c4a4e82f2e8919cf91245800656cf2bb7ec25aa0",
      "2025-05-02 13:12:32",
      0.0001,
    ),
  ],
});
