import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { assets, claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `zden/level_3`. */
export const zdenPuzzleLevel3 = bitcoinPuzzle({
  id: "zden/level_3",
  address: p2pkh("1cryptoJzomVVJUSys8Qv1gKPCXFoZy1U", "06c84797d250f130abafce9eafefea3f425e162e"),
  sourceUrl: "https://crypto.haluska.sk/",
  startedAt: "2016-06-23 17:10:53",
  status: Status.Solved,
  pubkey: uncompressed(
    "043648d46ea6de8285c56df043a9f438693692c33da0bacb0f3383e65d9983a8bf12be321634a4fdbc5cb58bd76a2c62a7546e3f70d6b28c35d5843527583ad48f",
  ),
  key: hex("6008c37d0aa226dbbe611be64106964bca6cbba7098fe4602a932c590e14b074").wif(
    "5JYaeV69haogQrDcGuW2Pmux8Mm2qtGYr9T2psxiKYfmhDYErQ2",
  ),
  prize: 0.0260414,
  solvedAt: "2016-06-26 02:02:09",
  solveTime: 204676,
  transactions: [
    funding(
      "ee4c9fc25759c5fbb1550f46bdbd93116c877a5651a4c50486fbe4c4454e3c6d",
      "2016-06-23 17:10:53",
      0.0260414,
    ),
    claim(
      "7d3ea8963136ef9a97cf37d42f7eb95aab14d92b0d075369d0cd0329bb51afe4",
      "2016-06-26 02:02:09",
      0.0260414,
    ),
  ],
  assets: assets({
    puzzle: "level_3/puzzle.png",
    solution: "level_3/solver.png",
    sourceUrl: "https://crypto.haluska.sk/crypto3.png",
  }),
});
