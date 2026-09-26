import { artifact, funding, stage, standard } from "../../core/parts.ts";
import { ethereumPuzzle } from "../../core/puzzle.ts";

const address = "0x973c2178b09225d1de3ab037d40b3f24af696255";
const source = `https://etherscan.io/address/${address}#code`;

/** The first commit and reveal TeikhosBounty, which masks with the Keccak-512 of the key. */
export const teikhos3 = ethereumPuzzle({
  id: "teikhos/3",
  address: standard(address),
  sourceUrl: source,
  startedAt: "2018-03-14 01:26:29",
  prize: 0.5,
  stages: [
    stage(
      "commit, authenticate, reveal, reward",
      "The mask is now the Keccak-512 of the public key, computed by a separate SHA3_512 contract, and authenticate() refuses anyone who hasn't committed first. The right key opens a seven day window to reveal a signature over it, the earliest valid commit wins, and reward() pays after that, back to the author if nobody revealed.",
      [artifact("verified contract source", source)],
    ),
  ],
  transactions: [
    funding(
      "0x92987048c9221675e133b7057a26c4420f5e77a59ff4e58b4df1ea535fa0c61b",
      "2018-03-14 01:26:29",
      0.5,
    ),
  ],
});
