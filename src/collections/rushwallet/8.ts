import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/8`. */
export const rushwalletPuzzle8 = bitcoinPuzzle({
  id: "rushwallet/8",
  address: p2pkh("1BgDHVsu56WwTtCTSsUkiE9Goc4KZcrgvR", "751bbc218d4d05d818f36c840149789f90124f77"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:17:14",
  status: Status.Solved,
  pubkey: uncompressed(
    "04e6d5be924603485a80cccb51f8c2bfbb4acdfbf9d65acc58c3b40970c18166a92a609a2c03054ca17a4ad24cc7309e7f9f6a5258eb334815e6e52a3e32284787",
  ),
  key: hex("78ac7258680117f5292c011eb9a823cedd7cf063564b3c1e84361a7ea40890a4")
    .wif("5JjS2XduetuMWs22rCnKbDABvv2UBmTVq8snNwWSikyVfXSSXkn")
    .passphrase("Let's get a new keyboard for this guy, my ears bleed when I sleep."),
  solvedAt: "2014-09-29 20:26:35",
  solveTime: 605361,
  transactions: [
    funding(
      "187e6d6a8c5f5bdce59e3fe3fa95320550a86844870d7860b53a9bfb7447c1cd",
      "2014-09-22 20:17:14",
      0.025,
    ),
    claim(
      "977c6fe974874110e1b1b321d852db8525fe588db9aae9c065cf059f74081d34",
      "2014-09-29 20:26:35",
      0.025,
    ),
  ],
});
