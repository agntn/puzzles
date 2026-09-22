import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { assets, claim, funding, p2pkh, party, profile, uncompressed } from "../../core/parts.ts";

/** Puzzle `zden/level_4`. */
export const zdenPuzzleLevel4 = bitcoinPuzzle({
  id: "zden/level_4",
  address: p2pkh("1cryptoRMRnj7Q9fgToxTRvejLnx3QRPq", "06c84797d273a88bcbcf0a98fd675aeae0447b56"),
  sourceUrl: "https://crypto.haluska.sk/",
  startedAt: "2017-06-07 12:19:28",
  status: Status.Solved,
  pubkey: uncompressed(
    "042348aa53c41b59a87be13846d37160538e6e6addb254116dc40223fcf2925e013d1cbfd764193f9268122c0444038a0c798f540874d6f0b9b182b8ced6dc98eb",
  ),
  prize: 0.0260414,
  solvedAt: "2017-06-11 22:26:45",
  solveTime: 382037,
  solver: party("mmorsl", {
    profiles: [profile("steemit", "https://steemit.com/@mmorsl")],
  }),
  transactions: [
    funding(
      "5388f28ec0c07cdb8a670c45947f803f6484dd46d1060eb47bf9ff10fa06f04e",
      "2017-06-07 12:19:28",
      0.0260414,
    ),
    claim(
      "67c3341bad6f1087b248b361ba14336d2ffdbd7b2272e24ea9d684d131ec823a",
      "2017-06-11 22:26:45",
      0.0260414,
    ),
  ],
  assets: assets({
    puzzle: "level_4/puzzle.png",
    solution: "level_4/solution.md",
    sourceUrl: "https://crypto.haluska.sk/crypto4.png",
  }),
});
