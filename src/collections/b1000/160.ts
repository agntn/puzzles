import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { bits, compressed, funding, increase, p2pkh, pubkeyReveal } from "../../core/parts.ts";

/** Puzzle `b1000/160`. */
export const b1000Puzzle160 = bitcoinPuzzle({
  id: "b1000/160",
  address: p2pkh("1NBC8uXJy1GiJ6drkiZa1WuKn51ps7EPTv", "e84818e1bf7f699aa6e28ef9edfb582099099292"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  pubkey: compressed("02e0a8b039282faf6fe0fd769cfbc4b6b4cf8758ba68220eac420e32b91ddfa673"),
  key: bits(160),
  prize: 16.001191,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.16,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      1.44,
    ),
    increase(
      "336043f3a5f08e4f08dc25bf7ae61aa74d008641a55e4a8e37d2a71a2d0fbd65",
      "2019-02-24 21:48:34",
      0.00000793,
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
      "6b2f1287b8e6f9b4394977a2d389313647ef0f004d6ef0f752a03d014a10a021",
      "2022-11-14 13:12:25",
      0.000015,
    ),
    increase(
      "12f34b58b04dfb0233ce889f674781c0e0c7ba95482cca469125af41a78d13b3",
      "2023-04-16 06:29:48",
      14.4,
    ),
    increase(
      "f28d7dda479bc61ac34fc762226634e51135b6a6609b2a774e1e4495f9f996ed",
      "2023-09-25 15:00:17",
      0.00003768,
    ),
    increase(
      "d864c1a02f3ba7028d4a0723bc64102b04d3afea7e2a114e2d6db515489750ff",
      "2023-10-23 08:45:40",
      0.000006,
    ),
    increase(
      "4cab5e1213071d60d6e452a6b4e9caefbbae44611c3dc2bd757a639a1f85fdd2",
      "2024-06-29 08:18:58",
      0.00000821,
    ),
    increase(
      "9ad34108526a0491386df4055dae20456551288aba2a8893fccdd6842ab29f7e",
      "2024-07-13 16:22:21",
      0.0001,
    ),
    increase(
      "e2e8e1988044d6195dc6f076a9d5810eec4f3493667b536ddec898dcacc10d4f",
      "2024-07-13 19:07:25",
      0.00001,
    ),
    increase(
      "65ef98ecd6392c4add3fd280f322baa252b697a1b1ab240db0876f004a88a405",
      "2025-01-09 18:32:51",
      0.000006,
    ),
    increase(
      "ae3c5d4277175a604a125f7b4461a083ca1a4dcfd5110b4c77ee773dea7a6877",
      "2025-05-02 09:59:40",
      0.001,
    ),
  ],
});
