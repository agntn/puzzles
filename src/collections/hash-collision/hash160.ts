import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { funding, p2sh, redeemScript } from "../../core/parts.ts";

/** Puzzle `hash-collision/hash160`. */
export const hashCollisionPuzzleHash160 = bitcoinPuzzle({
  id: "hash-collision/hash160",
  address: p2sh(
    "39VXyuoc6SXYKp9TcAhoiN1mb4ns6z3Yu6",
    "55951b1e750beb68712edae7042ffeb7491c388d",
    redeemScript("55951b1e750beb68712edae7042ffeb7491c388d", "6e879169a97ca987"),
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
