import { puzzle } from "../../core/puzzle.ts";
import { bits, compressed, funding, increase, pubkeyReveal } from "../../core/parts.ts";

/** Puzzle `bits/150`. */
export const bits150 = puzzle({
  id: "bits/150",
  chain: "bitcoin",
  address: "1MUJSJYtGPVGkBCTqGspnxyHahpt5Te8jy",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  pubkey: compressed("03137807790ea7dc6e97901c2bc87411f45ed74a5629315c4e4b03a0a102250c49"),
  key: bits(150),
  prize: 15.000016,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.15,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      1.35,
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
      13.5,
    ),
    increase(
      "284ef13f3a81cb301fa1bf570f2cdfeb27d8d93140b9a14950a1a5769ac60071",
      "2025-01-27 14:15:16",
      0.000006,
    ),
  ],
});
