import { assets, claim, compressed, funding, p2wpkh, seed } from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

const source =
  "https://github.com/floflo777/open-crypto-puzzles/tree/main/4-solved/dug-student-treasure-hunt-63ksats";

/** Funded BIP84 address 2 of Dug's 2025 student treasure hunt. */
export const dug2025Index2 = bitcoinPuzzle({
  id: "dug/2025-2",
  address: p2wpkh(
    "bc1qnclravnmv7vta9fhnp44hu3y85z3tfgz0n33wl",
    "9e3e3eb27b6798be9537986b5bf2243d0515a502",
  ),
  sourceUrl: source,
  startedAt: "2026-06-26 10:31:49",
  status: Status.Solved,
  solvedAt: "2026-07-08 14:43:50",
  prize: 0.00020888,
  key: seed(
    "profit general lava hover jar visa joy immense install first give kingdom",
    "m/84'/0'/0'/0/2",
  ),
  pubkey: compressed("03f505827081f5a8e74e554d1085c4e9b636aade0dc3a44e04a02e9d0a3d796afe"),
  assets: assets({ solution: "2025-solution.md", sourceUrl: source }),
  transactions: [
    funding(
      "8baaaebcd67605cb8f6621380095ca45585efa6a6f3b61948858f038321fdd35",
      "2026-06-26 10:31:49",
      0.00020888,
    ),
    claim(
      "bcc2154f4eb33c361973313b9fe81131568b2f4ee3ef5a2c3e98dc327afd8074",
      "2026-07-08 14:43:50",
      0.00020888,
    ),
  ],
});
