import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, compressed, funding, increase, p2pkh, pubkeyReveal } from "../../core/parts.ts";

/** Puzzle `b1000/140`. */
export const b1000Puzzle140 = bitcoinPuzzle({
  id: "b1000/140",
  address: p2pkh("1QKBaU6WAeycb3DbKbLBkX7vJiaS8r42Xo", "ffbb35a7bb9bbe16c1aa2534f7ff11d59c8e3d1a"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  pubkey: compressed("031f6a332d3c5c4f2de2378c012f429cd109ba07d69690c6c701b6bb87860d6640"),
  key: bits(140),
  prize: 14.000016,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.14,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      1.26,
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
      "d8c38d06fe7ea6adf44c5cc2cbf50083ec9cd8a3fc6c537e8d39db30639e8a77",
      "2022-11-19 17:06:31",
      0.00001,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      12.6,
    ),
    increase(
      "dd23b1079095ec6821f003b5a1acd5942152f478411157d717c8bddf8f67fb94",
      "2025-01-28 07:26:00",
      0.000006,
    ),
  ],
});
