import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/28`. */
export const rushwalletPuzzle28 = bitcoinPuzzle({
  id: "rushwallet/28",
  address: p2pkh("14yaVUgstpqavPEFtyit3wEWsyumysqxZV", "2b9ba0c9f11722716ba57b4e5a6d1aacacfe5d3d"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:17:14",
  status: Status.Solved,
  pubkey: uncompressed(
    "0421bb390cdfda9ea9aebbabd1bd944337a98a54d627fe2c51b7873653f591d5d2b945391f85e7d9219bf4f95bea387795ddb05fe937280700737607c0194ae02e",
  ),
  key: hex("fcf72cce6f8d959c27007355e04e3af112cbe7d7ed4d7ef971327c8b77b22961")
    .wif("5KjhFF7i5bYENHvsvtWjLpjuvrgybEeL4VuyLn6mpUGA2Q8Lv1o")
    .passphrase("Dmitri Enrique Nancy"),
  solvedAt: "2014-09-24 23:14:24",
  solveTime: 183430,
  transactions: [
    funding(
      "f76ca64ec5751717c4f87f3d1a5cd0f89b1572cdcb42ef3c164ae9b18ef8c452",
      "2014-09-22 20:17:14",
      0.05,
    ),
    claim(
      "f015d230ce56ca9d740e71527f425aa7d610125046d31ac2f219ce0bc97e3f10",
      "2014-09-24 23:14:24",
      0.05,
    ),
  ],
});
