import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import {
  assets,
  digest,
  claim,
  fact,
  funding,
  p2pkh,
  party,
  profile,
  uncompressed,
} from "../../core/parts.ts";

/** Puzzle `zden/level-4`. */
export const zdenPuzzleLevel4 = bitcoinPuzzle({
  id: "zden/level-4",
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
    key: "mmorsl",
    about:
      "Steemit user who won Zden's Level 4 and wrote the solution article Zden's catalogue links to.",
    profiles: [profile("steemit", "https://steemit.com/@mmorsl")],
    facts: [
      fact(
        "Published the solution article on Steemit, which Zden's catalog links as the article by the winner.",
        "https://steemit.com/bitcoin/@mmorsl/solution-of-the-bitcoin-crypto-puzzle-level-4-by-zden",
        { date: "2017-06-12" },
      ),
    ],
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
    puzzle: "level-4/puzzle.png",
    solution: "level-4/solution.md",
    sourceUrl: "https://crypto.haluska.sk/crypto4.png",
    digests: [
      digest(
        "level-4/puzzle.png",
        "763c4ae057800bbab03130cd1a73e0b47cb4afe84bfa2cc57ef446fe339e82cf",
        91923,
        {
          url: "https://crypto.haluska.sk/crypto4.png",
          archive:
            "https://web.archive.org/web/20181224203405id_/http://crypto.haluska.sk/crypto4.png",
        },
      ),
      digest(
        "level-4/solution.md",
        "5cdb68b30249f057ecc71a4858200a6f15580846407daa6422b089cd9676c447",
        916,
      ),
    ],
  }),
});
