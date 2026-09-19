import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { assets, confirmation, funding, increase, official, p2pkh } from "../../core/parts.ts";

/** Puzzle `zden/level_5`. */
export const zdenPuzzleLevel5 = bitcoinPuzzle({
  id: "zden/level_5",
  address: p2pkh("1cryptoGeCRiTzVgxBQcKFFjSVydN1GW7", "06c84797d2441393513e2169338e00cf2e755c8c"),
  sourceUrl: "https://crypto.haluska.sk/crypto5fix.png",
  startedAt: "2018-10-20 18:46:57",
  prize: 0.0055555,
  transactions: [
    funding(
      "3dde5372e50d314df6e0f46477b99e34a20fbe38721fa9519a2cdf6c51518c38",
      "2018-10-20 18:46:57",
      0.00260414,
    ),
    increase(
      "2a3e02a4a07e87f3e216a7d25d12f60222625a81c10882e27c9c3ea238a27df4",
      "2018-11-08 17:20:10",
      0.00088248,
    ),
    increase(
      "9b4c2a2aac20af67acf349d7b55ff94ccccdcbf9681f730da185fe1da564f884",
      "2021-02-14 04:14:05",
      0.00001338,
    ),
    increase(
      "33d0b16e4f4c9e9e0e0d6fe450d108a90629f199e14835bb94d4376388a944a1",
      "2021-12-03 08:55:29",
      0.0020555,
    ),
  ],
  assets: assets({
    puzzle: "level_5/puzzle.png",
    sourceUrl: "https://crypto.haluska.sk/crypto5fix.png",
  }),
  hints: [
    official(
      "Sum of two consecutive following rectangles areas creates one byte of the private key. Apply more operations to obtain the results in byte range.",
      "https://twitter.com/Zd3N/status/1077146640090316800",
      confirmation(
        "https://web.archive.org/web/20220129183939/https://twitter.com/Zd3N/status/1077146640090316800",
        "Wayback capture of the tweet, the BTCrypto L5 part of a hints bundle",
      ),
      { date: "2018-12-24 10:19:06" },
    ),
    official(
      "The new corrected version including new hints! UNSOLVED for over 3 years because the original release was uncomplete! Relaunched on 12th of December 2021. My excuses to everyone!",
      "https://crypto.haluska.sk/",
      confirmation(
        "https://web.archive.org/web/20220124172559/https://crypto.haluska.sk/",
        "Wayback capture of the puzzle page",
      ),
    ),
    official(
      "(clarity edit: sum of two ~~consecutive~~ following rectangles...)",
      "https://crypto.haluska.sk/",
      confirmation(
        "https://web.archive.org/web/20220124172559/https://crypto.haluska.sk/",
        "Wayback capture of the puzzle page, which strikes consecutive out of the 2018 hint",
      ),
    ),
  ],
});
