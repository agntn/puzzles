import { puzzle } from "../../core/puzzle.ts";
import { assets, confirmation, digest, funding, official } from "../../core/parts.ts";

/** Puzzle `zden/level-halv`. */
export const zdenPuzzleLevelHalv = puzzle({
  id: "zden/level-halv",
  chain: "bitcoin",
  address: "1crypto24HCr178iMcKd5iUi5D4rsg1nK",
  sourceUrl: "https://crypto.haluska.sk/cryptoHALV.png",
  startedAt: "2024-04-18 10:59:41",
  prize: 0.003125,
  transactions: [
    funding(
      "30946152b5f24ed975a26b28a46cb19d1ef2728159c5806544ffd0c2fb535205",
      "2024-04-18 10:59:41",
      0.003125,
    ),
  ],
  assets: assets({
    puzzle: "level-halv/puzzle.png",
    sourceUrl: "https://crypto.haluska.sk/cryptoHALV.png",
    digests: [
      digest(
        "level-halv/puzzle.png",
        "3a487ebaeb4801137f09159a2d533046936cd395f4e2f7d115ac554607790e95",
        61566,
        {
          url: "https://crypto.haluska.sk/cryptoHALV.png",
          archive:
            "https://web.archive.org/web/20250907231738id_/https://crypto.haluska.sk/cryptoHALV.png",
        },
      ),
    ],
  }),
  hints: [
    official(
      "Level HALV - my new crypto puzzle to celebrate the fourth Bitcoin Halving. This level is way easier than LVL 5. It shouldn't take long until it's solved.",
      "https://crypto.haluska.sk/",
      confirmation(
        "https://web.archive.org/web/20240519071031/https://crypto.haluska.sk/",
        "Wayback capture of the puzzle page",
      ),
    ),
  ],
});
