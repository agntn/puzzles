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
      "commit",
      "Store a signature before anything else. authenticate() refuses a sender without a commit, and the earliest valid commit wins.",
      [artifact("verified contract source", source)],
    ),
    stage(
      "authenticate",
      "Submit the public key whose Keccak-512, computed by a separate SHA3_512 contract, unmasks the stored proof into a signature by that key. The right key marks the bounty solved and opens a seven day window.",
      [artifact("verified contract source", source)],
    ),
    stage(
      "reveal",
      "Inside the window, reveal your commit. It counts when it is a signature by your own address over the message the key signed.",
      [artifact("verified contract source", source)],
    ),
    stage(
      "reward",
      "After the seven days anyone can call it. The contract self-destructs to the winner, or back to the author if nobody revealed a valid commit.",
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
