import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/2`. */
export const rushwalletPuzzle2 = bitcoinPuzzle({
  id: "rushwallet/2",
  address: p2pkh("1ECmvpGxQWaRf73xxRejJAKEPA57NA77WN", "90d3b6f30e3cd2afd0a8927b73ad80e48ac27c14"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 17:36:08",
  status: Status.Solved,
  pubkey: uncompressed(
    "04d8e760ace95152182ac423d6e1ecf273dd340004242a305352806ce4d630ee9ed19242ca6c6b43f7adaedf9f67dae3c267f42488ccee6244a2dd18c37984ca39",
  ),
  key: hex("f52279589f480c41864aad5641300b2f92f0cc8488f90339564cfee4f2d1c31e")
    .wif("5KgFDZv8uSJS9mEsyKKs2iyPBfhbGLft8yw8PCoLgh3VugM98jv")
    .passphrase("AGKPX AGKPX AGKPX AGKPX AGKPX AGKPX"),
  solvedAt: "2014-09-23 15:42:08",
  solveTime: 79560,
  transactions: [
    funding(
      "3a923499b984493a67892aeedf6feb6c230467e72ad9da88e173542e8326dbfe",
      "2014-09-22 17:36:08",
      0.025,
    ),
    claim(
      "be8f7425ab201b15d2e145436d05e61108ab64002e43b3066af66629b4348823",
      "2014-09-23 15:42:08",
      0.025,
    ),
  ],
});
