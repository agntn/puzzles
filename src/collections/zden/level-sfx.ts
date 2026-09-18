import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { assets, claim, funding, increase, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `zden/level_sfx`. */
export const zdenPuzzleLevelSfx = bitcoinPuzzle({
  id: "zden/level_sfx",
  address: p2pkh("1crypto92aYKxdzD6VSAKwpEJnXcA2s9t", "06c84797d21a7c43dce76bf6f510114560d6a135"),
  sourceUrl: "https://crypto.haluska.sk/cryptoSFX.png",
  startedAt: "2021-02-07 23:57:58",
  status: Status.Solved,
  pubkey: uncompressed(
    "04f3522614fabf280019a1c7005523808d4f08afa8084c483fe4e02b92a7ae587c264138073c19f1106b7670a23c4f4bb7e08b3cc75254f45b7cdbb958cf97abc3",
  ),
  prize: 0.00140426,
  solvedAt: "2021-02-21 22:49:26",
  solveTime: 1205488,
  transactions: [
    funding(
      "570c201d362534d8a21908bee29cd385d618805819401b1084b76f37ce5ceb4e",
      "2021-02-07 23:57:58",
      0.00140426,
    ),
    increase(
      "9b4c2a2aac20af67acf349d7b55ff94ccccdcbf9681f730da185fe1da564f884",
      "2021-02-14 04:14:05",
      0.00004574,
    ),
    increase(
      "75abad484d2cb32ad37bdc321e100f8d21111cb1f6e11729279c3689e47ea274",
      "2021-02-15 08:47:12",
      0.001337,
    ),
    claim(
      "cf34cd09943b49bbcd2d5c58c09b43ed054c911f2d526db3a59c015d9f6d8360",
      "2021-02-21 22:49:26",
      0.00274126,
    ),
  ],
  assets: assets({
    puzzle: "level_sfx/puzzle.png",
    sourceUrl: "https://crypto.haluska.sk/cryptoSFX.png",
  }),
});
