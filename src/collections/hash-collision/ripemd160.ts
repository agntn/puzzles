import { puzzle } from "../../core/puzzle.ts";
import { funding, p2sh, redeemScript, technique } from "../../core/parts.ts";

/** Puzzle `hash-collision/ripemd160`. */
export const hashCollisionPuzzleRipemd160 = puzzle({
  id: "hash-collision/ripemd160",
  chain: "bitcoin",
  address: p2sh(
    "3KyiQEGqqdb4nqfhUzGKN6KPhXmQsLNpay",
    "c89ab551eab767697bc4d9caca650c41b39497c6",
    redeemScript("c89ab551eab767697bc4d9caca650c41b39497c6", "6e879169a67ca687"),
  ),
  sourceUrl: "https://bitcointalk.org/index.php?topic=293382.0",
  startedAt: "2013-09-13 05:59:09",
  techniques: [technique("hash-collision", "https://bitcointalk.org/index.php?topic=293382.0")],
  prize: 0.115769,
  transactions: [
    funding(
      "397f12ee15f8a3d2ab25c0f6bb7d3c64d2038ca056af10dd8251b98ae0f076b0",
      "2013-09-13 05:59:09",
      0.1,
    ),
  ],
});
