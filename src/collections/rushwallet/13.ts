import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/13`. */
export const rushwalletPuzzle13 = bitcoinPuzzle({
  id: "rushwallet/13",
  address: p2pkh("1GwQ9ik3PH6g4BzwShFdwf2AEhUyfQVBpn", "aed3ac72970ce184ee6e0e67e5b67bfc9197450a"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:17:14",
  status: Status.Solved,
  pubkey: uncompressed(
    "044ab4e97848419c137b1c9e652bd4dfafb6f07cfd2e006a4f073c655550386c4c8c39465fc432d30d2ae6b43b4369162903b900de8adeae9f5dc3bf262368fa07",
  ),
  key: hex("f236c7a3bdde16d8264ea2e9d82347721a831a324fc5f42870eed8a720270100")
    .wif("5KexcVAqjA8KcXuU49V2newSVFVQb69BPM1hMft6tGyKQnLTWim")
    .passphrase("rushwallet brainwallets are easy to use"),
  solvedAt: "2014-10-03 21:02:28",
  solveTime: 953114,
  transactions: [
    funding(
      "86158ded0cd15f16348319e75687015bc82d167f4f4c013ca9703a2adde41905",
      "2014-09-22 20:17:14",
      0.025,
    ),
    claim(
      "14710d11301c0ce117eca620051e81e919470989b74fbfcaa6172ff5cd9e2b40",
      "2014-10-03 21:02:28",
      0.025,
    ),
  ],
});
