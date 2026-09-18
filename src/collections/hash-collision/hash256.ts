import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { funding, p2sh, redeemScript } from "../../core/parts.ts";

/** Puzzle `hash_collision/hash256`. */
export const hashCollisionPuzzleHash256 = bitcoinPuzzle({
  id: "hash_collision/hash256",
  address: p2sh(
    "3DUQQvz4t57Jy7jxE86kyFcNpKtURNf1VW",
    "813ee00988dc0188450da05b77bd2d3e887f2ca4",
    redeemScript("813ee00988dc0188450da05b77bd2d3e887f2ca4", "6e879169aa7caa87"),
  ),
  sourceUrl: "https://bitcointalk.org/index.php?topic=293382.0",
  startedAt: "2013-09-13 05:59:09",
  prize: 0.100269,
  transactions: [
    funding(
      "397f12ee15f8a3d2ab25c0f6bb7d3c64d2038ca056af10dd8251b98ae0f076b0",
      "2013-09-13 05:59:09",
      0.1,
    ),
  ],
});
