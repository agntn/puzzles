import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/4`. */
export const rushwalletPuzzle4 = bitcoinPuzzle({
  id: "rushwallet/4",
  address: p2pkh("1Ea5uafoorbr74iw7Xo764x2MKi8BF7uYK", "94db752d09f855fcdc195a1c44706c82835edcb3"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:17:14",
  status: Status.Solved,
  pubkey: uncompressed(
    "04b59099bebdcb23940a81223302234b4b1acc2473d4e116b4d96e9e44e5c9c50a6ff85a4df5d1ca86229ce85007b360e6a0af16fdefa7734e0afd21c0d2f9298d",
  ),
  key: hex("874f1a008f432a402c5bdb0b4374ebda7f120ba57d9edc820d9757d9818b42cb")
    .wif("5JqssJS94cr9ibjFY97p6TD1ehBaFiR3Bhc2DdYgsz4wk6tSVqK")
    .passphrase("The honey badger of money The honey badger of money"),
  solvedAt: "2014-09-23 13:00:27",
  solveTime: 60193,
  transactions: [
    funding(
      "06378529826fee10c00812603abaabfa352a7226d3d29c06139a35d83098c638",
      "2014-09-22 20:17:14",
      0.025,
    ),
    claim(
      "534de85113e9cb79ccc8fdb313935599059793733b3aaf35548a2b431f8b04a4",
      "2014-09-23 13:00:27",
      0.025,
    ),
  ],
});
