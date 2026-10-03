import { puzzle } from "../../core/puzzle.ts";
import { funding, increase, p2sh, redeemScript, technique } from "../../core/parts.ts";

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
  prize: 0.11576888,
  transactions: [
    funding(
      "397f12ee15f8a3d2ab25c0f6bb7d3c64d2038ca056af10dd8251b98ae0f076b0",
      "2013-09-13 05:59:09",
      0.1,
    ),
    increase(
      "bff8ed5da3349d220210cd91b2c8cd192e326ca0f1c0570fe27b9793127431d6",
      "2013-09-14 05:55:50",
      0.0095,
    ),
    increase(
      "e107d9bc88c93d6409e8d0173b8b426ea701b12c529439f198ac0e39b6b7a1c0",
      "2014-10-10 08:58:50",
      0.00026888,
    ),
    increase(
      "f10275c6788eadc7334850093341b4d3ca8f25dcd82fdc577e03d6afccc93d75",
      "2017-02-26 06:58:47",
      0.005,
    ),
    increase(
      "2df75de1ba66c12ed8904f988bfc114d8cdb579af0816efa011b67fd6a2f83af",
      "2025-01-06 11:52:55",
      0.001,
    ),
  ],
});
