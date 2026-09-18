import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/12`. */
export const rushwalletPuzzle12 = bitcoinPuzzle({
  id: "rushwallet/12",
  address: p2pkh("1EWr7tvs8efFu15nvuL4RezVVoHFpxH2nF", "943eb3516d30cea4b98a20052548e1601868616d"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:17:14",
  status: Status.Solved,
  pubkey: uncompressed(
    "040f6968c1f39b2f869891b742a34d2f0153e8c6a538e6a0d50095d03f16257226138b9f0a359ff4899e5249d15a6ac71bc13c19591dc0da2ca032bfc9efbbcb94",
  ),
  key: hex("142e3512dd89fbc3f7fe005d87ff49a58cca7c82a50a2ff1b0f5e64e86b16b48")
    .wif("5HyB4jgZUTrkawvPY872koRsNy2f1VY3RT5DnEpBNsmV6HdPCd9")
    .passphrase("www.rushwallet.com"),
  solvedAt: "2014-09-23 12:44:13",
  solveTime: 59219,
  transactions: [
    funding(
      "49d7d7d1af718c1eb39d01b574c2dcb41d7aded066167aa0b1765e8d21f1ac60",
      "2014-09-22 20:17:14",
      0.025,
    ),
    claim(
      "8466270fd586c3d56bf49f64c9165cac88fc96262a994db5152ad012c4238ece",
      "2014-09-23 12:44:13",
      0.025,
    ),
  ],
});
