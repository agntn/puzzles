import { assets, claim, compressed, funding, p2wpkh, seed } from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

const source =
  "https://github.com/floflo777/open-crypto-puzzles/tree/main/4-solved/dug-student-treasure-hunt-63ksats";

/** Funded BIP84 address 0 of Dug's 2025 student treasure hunt. */
export const dug2025Index0 = bitcoinPuzzle({
  id: "dug/2025-0",
  address: p2wpkh(
    "bc1qych2me6h85j38s3xmfwdkcvpqakpld3yr2y5ss",
    "262eade7573d2513c226da5cdb6181076c1fb624",
  ),
  sourceUrl: source,
  startedAt: "2025-06-26 07:10:21",
  status: Status.Solved,
  solvedAt: "2026-07-08 14:43:50",
  prize: 0.00075082,
  key: seed(
    "profit general lava hover jar visa joy immense install first give kingdom",
    "m/84'/0'/0'/0/0",
  ),
  pubkey: compressed("0306b973c11d5a15de593a8906a02f689e51e19148acc91b586e69383ca5f610f1"),
  assets: assets({ solution: "2025-solution.md", sourceUrl: source }),
  transactions: [
    funding(
      "58ae2f1560e9b72f4a35e892c50d9bedc7e6dec7b6474250d25440c8bc92feb5",
      "2025-06-26 07:10:21",
      0.00075082,
    ),
    claim(
      "bcc2154f4eb33c361973313b9fe81131568b2f4ee3ef5a2c3e98dc327afd8074",
      "2026-07-08 14:43:50",
      0.00075082,
    ),
  ],
});
