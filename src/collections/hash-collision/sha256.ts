import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { funding, p2sh, redeemScript } from "../../core/parts.ts";

/** Puzzle `hash-collision/sha256`. */
export const hashCollisionPuzzleSha256 = bitcoinPuzzle({
  id: "hash-collision/sha256",
  address: p2sh(
    "35Snmmy3uhaer2gTboc81ayCip4m9DT4ko",
    "292fb39df7cd619a396069383928e6bfb74ebec5",
    redeemScript("292fb39df7cd619a396069383928e6bfb74ebec5", "6e879169a87ca887"),
  ),
  sourceUrl: "https://bitcointalk.org/index.php?topic=293382.0",
  startedAt: "2013-09-13 05:59:09",
  prize: 0.277343,
  transactions: [
    funding(
      "397f12ee15f8a3d2ab25c0f6bb7d3c64d2038ca056af10dd8251b98ae0f076b0",
      "2013-09-13 05:59:09",
      0.1,
    ),
  ],
});
