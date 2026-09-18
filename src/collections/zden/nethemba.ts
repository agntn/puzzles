import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { assets, claim, funding, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `zden/nethemba`. */
export const zdenPuzzleNethemba = bitcoinPuzzle({
  id: "zden/nethemba",
  address: p2pkh("1cryptoP5yMdKcz1bjzUqnbs3LsasVRX6", "06c84797d267472edfe262ab43b2d6844e8bac9b"),
  sourceUrl: "https://crypto.haluska.sk/crypto_nethemba.png",
  startedAt: "2016-08-06 12:05:26",
  status: Status.Solved,
  pubkey: uncompressed(
    "0448ececabf97b8b0b17c96d6908ee913192855f05040764776b2ba33de2c354d3149b187b8ff65f6b429ce363296766d61ef0c16261ad0bc1e40679c6b8571d2c",
  ),
  prize: 0.192018,
  solvedAt: "2016-08-11 17:30:46",
  solveTime: 451520,
  transactions: [
    funding(
      "72670ce7a71e6a0cf456dcdc7734df6064283ffdd548c574b2a80254c3c9406c",
      "2016-08-06 12:05:26",
      0.192018,
    ),
    claim(
      "be452ac0b3ed8b4e81bfad38831a89ccdb54a18f7d21b002e0d4c0537bc9541b",
      "2016-08-11 17:30:46",
      0.192018,
    ),
  ],
  assets: assets({
    puzzle: "nethemba/puzzle.png",
    sourceUrl: "https://crypto.haluska.sk/crypto_nethemba.png",
  }),
});
