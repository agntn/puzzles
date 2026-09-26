import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { assets, claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `zden/level-xm17`. */
export const zdenPuzzleLevelXm17 = bitcoinPuzzle({
  id: "zden/level-xm17",
  address: p2pkh("1cryptozWJAE7UzDZF1eSgsT7mVjUsu7g", "06c84797d328c065190a6768e20a84b7a17916c0"),
  sourceUrl: "https://crypto.haluska.sk/cryptoxm17.gif",
  startedAt: "2017-12-24 18:10:13",
  status: Status.Solved,
  pubkey: uncompressed(
    "04a7daaeb780428349a532386cbe4570c2765265099a5cabb6614abbbc16e0eed968f012d4e999a2726ec101402af57d4d99813d86ca6a1de7bf15ec6ff740ab6e",
  ),
  key: hex("f85204261fa2cef0febb7eefc1bf64105e51351039ed4dd26ee6f427cc403e98").wif(
    "5KhebJWTSHq8wpSKKMhxroKuwrCA8UMS4WKSLpTcH4gDGJz1jqo",
  ),
  prize: 0.0260414,
  solvedAt: "2017-12-26 19:28:42",
  solveTime: 177509,
  transactions: [
    funding(
      "b640f0671cb59f47a197584d7a9cf67bdd2f7e6227a74bd4bdae89067e1b34a2",
      "2017-12-24 18:10:13",
      0.0260414,
    ),
    claim(
      "2706880fbfe65638c1ce6229538a1c51f6d7c693d7405fd586d69752535b4302",
      "2017-12-26 19:28:42",
      0.0260414,
    ),
  ],
  assets: assets({
    puzzle: "level-xm17/puzzle.gif",
    solution: "level-xm17/solver.png",
    sourceUrl: "https://crypto.haluska.sk/cryptoxm17.gif",
  }),
});
