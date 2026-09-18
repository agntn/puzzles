import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { assets, derivation, funding, increase, p2wpkh, source } from "../../core/parts.ts";

/** Puzzle `bitimage/kitten_passphrase`. */
export const bitimagePuzzleKittenPassphrase = bitcoinPuzzle({
  id: "bitimage/kitten_passphrase",
  address: p2wpkh(
    "bc1qcyrndzgy036f6ax370g8zyvlw86ulawgt0246r",
    "c1073689047c749d74d1f3d071119f71f5cff5c8",
  ),
  sourceUrl:
    "https://corey-lyle-phillips.medium.com/part-1-3-turn-your-photos-into-bitcoin-private-keys-addresses-57669771cf7a",
  startedAt: "2019-06-28 08:06:08",
  key: derivation("m/84'/0'/0'/0/0").entropy(
    "1808d35318ac7cb98b69ff9779b699d6a631f15e0b353ac89b7c4020774832ed",
    source(
      "https://twitter.com/aantonop/status/603701870482300928",
      "Antonopoulos kitten tweet (May 2015)",
    ),
    "Required",
  ),
  prize: 0.010019,
  transactions: [
    funding(
      "c3a8c1eedc3512cc92e8798eb240d81bcb2446dfe91339bbafd5e9687c3c663d",
      "2019-06-28 08:06:08",
      0.01,
    ),
    increase(
      "1e4c42f9aedfbdea00c2134af18de6d449a1a88565486a4de5b749634ecc07d8",
      "2025-04-11 14:43:52",
      0.000019,
    ),
  ],
  assets: assets({
    puzzle: "kitten_passphrase/puzzle.jpg",
    sourceUrl: "https://twitter.com/aantonop/status/603701870482300928",
  }),
});
