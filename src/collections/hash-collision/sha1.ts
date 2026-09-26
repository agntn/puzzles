import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, p2sh, redeemScript } from "../../core/parts.ts";

/** Puzzle `hash-collision/sha1`. */
export const hashCollisionPuzzleSha1 = bitcoinPuzzle({
  id: "hash-collision/sha1",
  address: p2sh(
    "37k7toV1Nv4DfmQbmZ8KuZDQCYK9x5KpzP",
    "4266fc6f2c2861d7fe229b279a79803afca7ba34",
    redeemScript("4266fc6f2c2861d7fe229b279a79803afca7ba34", "6e879169a77ca787"),
  ),
  sourceUrl: "https://bitcointalk.org/index.php?topic=293382.0",
  startedAt: "2013-09-13 04:48:29",
  status: Status.Claimed,
  prize: 2.48,
  solvedAt: "2023-02-22 23:00:49",
  solveTime: 298059140,
  transactions: [
    funding(
      "09de8e2de5f6261af40c522c8fcc008c6a8321368b4df707c0c2a8f431138a83",
      "2013-09-13 04:48:29",
      0.01,
    ),
    claim(
      "9ec2a0db0c4c3423a6b2c3cb2a26fc626b037121b4b5f3f57b08916196ff14e0",
      "2023-02-22 23:00:49",
      0.000096,
    ),
  ],
});
