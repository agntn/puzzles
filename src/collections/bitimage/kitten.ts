import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import {
  assets,
  claim,
  compressed,
  derivation,
  funding,
  p2wpkh,
  source,
} from "../../core/parts.ts";

/** Puzzle `bitimage/kitten`. */
export const bitimagePuzzleKitten = bitcoinPuzzle({
  id: "bitimage/kitten",
  address: p2wpkh(
    "bc1q57euh23y3qs2f9d5mtwpax5lqecfvrdkqce82a",
    "a7b3cbaa248820a495b4dadc1e9a9f0670960db6",
  ),
  sourceUrl:
    "https://corey-lyle-phillips.medium.com/part-1-3-turn-your-photos-into-bitcoin-private-keys-addresses-57669771cf7a",
  startedAt: "2019-07-03 02:48:04",
  status: Status.Solved,
  pubkey: compressed("021209b131dfbd1efcfe15b1d1e92002653f5fc98e9ff6cb73a0d70153dbe58463"),
  key: derivation("m/84'/0'/0'/0/0").entropy(
    "1808d35318ac7cb98b69ff9779b699d6a631f15e0b353ac89b7c4020774832ed",
    source(
      "https://twitter.com/aantonop/status/603701870482300928",
      "Antonopoulos kitten tweet (May 2015)",
    ),
  ),
  prize: 0.00095133,
  solvedAt: "2019-07-09 21:26:12",
  solveTime: 585488,
  transactions: [
    funding(
      "1482b329809e168c61a40966e9ffb029ad20a2c0022bd0e55efeea35b8a9409c",
      "2019-07-03 02:48:04",
      0.00095133,
    ),
    claim(
      "49638d16a21133febb093580527e50039eee630e2c4918a0654a71ef437ad093",
      "2019-07-09 21:26:12",
      0.00095133,
    ),
  ],
  assets: assets({
    puzzle: "kitten/puzzle.jpg",
    sourceUrl: "https://twitter.com/aantonop/status/603701870482300928",
  }),
});
