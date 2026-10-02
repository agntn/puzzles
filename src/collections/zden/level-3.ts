import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { assets, digest, claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `zden/level-3`. */
export const zdenPuzzleLevel3 = bitcoinPuzzle({
  id: "zden/level-3",
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
    puzzle: "level-3/puzzle.png",
    solution: "level-3/solver.png",
    sourceUrl: "https://crypto.haluska.sk/crypto3.png",
    digests: [
      digest(
        "level-3/puzzle.png",
        "f3752aca93285c3c307e5f34108422f81eb9a8b03df1eeac74b6f9b58f40478d",
        12141,
        {
          url: "https://crypto.haluska.sk/crypto3.png",
          archive:
            "https://web.archive.org/web/20240929171219id_/https://crypto.haluska.sk/crypto3.png",
        },
      ),
      digest(
        "level-3/solver.png",
        "9a5c1457f575c638cd07998ce582a026d8608cb19712983fb9965ea766ad767a",
        24826,
        {
          url: "https://crypto.haluska.sk/crypto3solver.png",
          archive:
            "https://web.archive.org/web/20250816133449id_/http://crypto.haluska.sk/crypto3solver.png",
        },
      ),
    ],
  }),
});
