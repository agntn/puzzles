import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, compressed, funding, increase, p2pkh, pubkeyReveal } from "../../core/parts.ts";

/** Puzzle `b1000/145`. */
export const b1000Puzzle145 = bitcoinPuzzle({
  id: "b1000/145",
  address: p2pkh("19GpszRNUej5yYqxXoLnbZWKew3KdVLkXg", "5abf369388deb8072741b4eb43ef10fa9388a729"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  pubkey: compressed("03afdda497369e219a2c1c369954a930e4d3740968e5e4352475bcffce3140dae5"),
  key: bits(145),
  prize: 14.500006,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.145,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      1.305,
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
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      13.05,
    ),
    increase(
      "35c62ac2e2118aea9167f918670ea9e60e4c82029da01b33f82756372faa53e7",
      "2025-01-28 03:11:55",
      0.000006,
    ),
  ],
});
