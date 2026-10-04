import { artifact, funding, increase, stage, technique } from "../../core/parts.ts";
import { puzzle } from "../../core/puzzle.ts";

const address = "0xd7c6d542f3dcdceda845112b8fd567b8f8655805";
const source = `https://etherscan.io/address/${address}#code`;

/** The TeikhosBounty with a second mask: the public key first unlocks a symmetric key. */
export const teikhos2 = puzzle({
  id: "teikhos/2",
  chain: "ethereum",
  address,
  sourceUrl: source,
  startedAt: "2018-02-27 15:57:38",
  techniques: [technique("xor", source)],
  prize: 0.500002026,
  stages: [
    stage(
      "authenticate",
      "Same check as teikhos/1 with one more layer. The public key XORs a stored proof into a symmetric key, and that key XORs the other stored proof into the signature. Still one 64-byte input, still ecrecover, still self-destructs to the sender.",
      [
        artifact("verified contract source", source),
        artifact(
          "ProofOfSymmetricKey.sol",
          "https://gist.github.com/resilience-me/be11a0ed3575dddca10df8263b53cc1d",
        ),
      ],
    ),
  ],
  transactions: [
    funding(
      "0x9e1f030874e54abeb4b4a6e07891c7c93ae0736f6ce3363ff323b1a83c0ef498",
      "2018-02-27 15:57:38",
      0.5,
    ),
    increase(
      "0x20c6ed219f4706349595e8ab909e3710272994f10eea8ac5826d917c674cbc83",
      "2026-06-22 00:22:35",
      0.000002026,
    ),
  ],
});
