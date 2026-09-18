import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/10`. */
export const rushwalletPuzzle10 = bitcoinPuzzle({
  id: "rushwallet/10",
  address: p2pkh("1EHxfmrG74HSv1dji6uxiKn1ts1pSPr4h7", "91cec2a35b8d01cd8a263b1e4f3edfb7df02f85a"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:17:14",
  status: Status.Solved,
  pubkey: uncompressed(
    "049f5a904e465dd5666b90069c7564994a20f8a1cccac86fa8f65bca875f536e62742afee3904bea3f577735ef75a318c95c18ba752de569b12c85b80a7d1d3162",
  ),
  key: hex("8416ea3c7bd1201df15410bb0e8a6b6cab676502004fa68bced5f42bbb6cf6b1")
    .wif("5JpTdYGejXzzGdKbBR36SpSAAWxMgcyQckpYFoMbSBYnzFFUZcn")
    .passphrase("happy birthday celebrate tony tony"),
  solvedAt: "2014-09-23 13:16:42",
  solveTime: 61168,
  transactions: [
    funding(
      "de7026fd9171e3a532cedae504536c2cc19ea6568a18775616756079735dbd1c",
      "2014-09-22 20:17:14",
      0.025,
    ),
    claim(
      "eec469a9d837a90c2becd06afda0f937f744880f82ccb9198211e2fdda8f4f62",
      "2014-09-23 13:16:42",
      0.025,
    ),
  ],
});
