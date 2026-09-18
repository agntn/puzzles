import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/15`. */
export const rushwalletPuzzle15 = bitcoinPuzzle({
  id: "rushwallet/15",
  address: p2pkh("17TF8fyceXiL81iJz4UhuT5sCiCJCPQSUz", "46c75de29b97b959d8f3b634ee7cd0c606d75c9b"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:17:35",
  status: Status.Solved,
  pubkey: uncompressed(
    "04b33bbd2d597fe950c5d0b0ea40976f0559ed8095358b314ff7539c4fb4b550960f2e466aa6f851af1bec92f0792e488eb33ac2cf36eb87c9ae54628de9ef45f6",
  ),
  key: hex("89c11d8b682a4ef7fdf4ad7ce2e937f13afefefb0215d4aaf3b2a20b9eca0f77")
    .wif("5JrxLC1LjDWhFYJGQQoC9FAMinChKFFssvDqZfhWSSCGQWdqE7Q")
    .passphrase("MAKERBLOCK MAKERBLOCK MAKERBLOCK MAKERBLOCK MAKERBLOCK"),
  solvedAt: "2014-09-23 15:12:09",
  solveTime: 68074,
  transactions: [
    funding(
      "7384b84f01718e57793237cc0ab0dee2e19ac99b7ee56d35780a02af3b342210",
      "2014-09-22 20:17:35",
      0.025,
    ),
    claim(
      "519b60499045c5a1b5f249ca416564ded46cea7b1cb7a8f2751a31964bc0d214",
      "2014-09-23 15:12:09",
      0.025,
    ),
  ],
});
