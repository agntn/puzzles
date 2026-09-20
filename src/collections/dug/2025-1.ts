import {
  assets,
  claim,
  compressed,
  funding,
  p2wpkh,
  party,
  profile,
  seed,
} from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

const source =
  "https://github.com/floflo777/open-crypto-puzzles/tree/main/4-solved/dug-student-treasure-hunt-63ksats";

/** Funded BIP84 address 1 of Dug's 2025 student treasure hunt. */
export const dug2025Index1 = bitcoinPuzzle({
  id: "dug/2025-1",
  address: p2wpkh(
    "bc1qphfklk568cf93267yetpngqsz0mthw4z4x2q69",
    "0dd36fda9a3e1258ab5e265619a01013f6bbbaa2",
  ),
  sourceUrl: source,
  startedAt: "2026-06-26 09:52:36",
  status: Status.Solved,
  solvedAt: "2026-08-02 12:12:29",
  prize: 0.00063216,
  key: seed(
    "profit general lava hover jar visa joy immense install first give kingdom",
    "m/84'/0'/0'/0/1",
  ),
  pubkey: compressed("030349e3498e3abcd935bacdc117533b9e3ce3ec05b2958b4ecadde7c68c9c8e45"),
  solver: party("floflo777", {
    profiles: [
      profile("github", "https://github.com/floflo777"),
      profile("twitter", "https://twitter.com/0xFlorent_"),
    ],
  }),
  assets: assets({ solution: "2025-solution.md", sourceUrl: source }),
  transactions: [
    funding(
      "35a1c6c2c7b01a1f9b83ce72f4bc6c748464e3b9f193375d3b80d2f350f48da6",
      "2026-06-26 09:52:36",
      0.00063216,
    ),
    claim(
      "ee70de514686588173b64fc31fc317ae15f1e903c742cc99140d2cf1bb2e8db1",
      "2026-08-02 12:12:29",
      0.00063216,
    ),
  ],
});
