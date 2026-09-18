import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/16`. */
export const rushwalletPuzzle16 = bitcoinPuzzle({
  id: "rushwallet/16",
  address: p2pkh("18WG8J9R7pKiAJ441msJPcawQ9BKp2Rox7", "525191db0fe6dfe778d704d246c7a972cfe2d835"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:17:35",
  status: Status.Solved,
  pubkey: uncompressed(
    "045c858b5674ffd7d4e0d265a862447725ed9d74e267dd6329afa85160c4527d6a1ba4b73e3ff2ee3430a0ff0d714a1c588c90895e8a4b1ac5a53173197a702e13",
  ),
  key: hex("83eeb2123d29ae80d6e5bebd3525ed057e5afd6a055ba0e2ff23b9448a64088c")
    .wif("5JpPcnF5fHdmhYJqyU4GRTTK2j72EBRDc9J5mHAX1yWro2twj8q")
    .passphrase("Tony's 3d Printer"),
  solvedAt: "2014-09-23 13:58:23",
  solveTime: 63648,
  transactions: [
    funding(
      "91f591cd63a596d5da52cf458485599390487bdb497cff58282833e3cd85e699",
      "2014-09-22 20:17:35",
      0.025,
    ),
    claim(
      "a49b00d400cef8c98c80e433b9dd2691de018e549f7f8bab0e605bdce3c2ec70",
      "2014-09-23 13:58:23",
      0.025,
    ),
  ],
});
