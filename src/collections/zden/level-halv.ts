import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { assets, confirmation, funding, official, p2pkh } from "../../core/parts.ts";

/** Puzzle `zden/level-halv`. */
export const zdenPuzzleLevelHalv = bitcoinPuzzle({
  id: "zden/level-halv",
  address: p2pkh("1crypto24HCr178iMcKd5iUi5D4rsg1nK", "06c84797d1f468b9d5773a61c80073b344df7470"),
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
