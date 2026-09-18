import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/18`. */
export const rushwalletPuzzle18 = bitcoinPuzzle({
  id: "rushwallet/18",
  address: p2pkh("1NUpp6S2LjpDBVu76r9LuhCrtrC6cXQNxp", "eb9dc8a9d4e7c34342a2c0e3166c24b607800298"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:32:38",
  status: Status.Solved,
  pubkey: uncompressed(
    "04e864a09c1516ed07696a02e299ad8442be91636f455862098ff55e89355e21e54d4b0d09e6219622bacc1c05f497c7cadefec322448d5623736382e4965db6b0",
  ),
  key: hex("570e7d1dac0f27426f47463b3cd0ec492034450b7a732fe04de49444a21fc336")
    .wif("5JUdKpzUHD8TumDnp2Tirz5JEtxFPkbpeTv3qPWMfRPWMX77zw8")
    .passphrase("BITCOIN ACROSS AMERICA BITCOIN ACROSS AMERICA"),
  solvedAt: "2014-09-23 13:06:18",
  solveTime: 59620,
  transactions: [
    funding(
      "82ebba32667639f6e8a2877e5a5f8cf75f02113f7667426653af644e499fe7f3",
      "2014-09-22 20:32:38",
      0.025,
    ),
    claim(
      "4345f9e968fb09eea1257d343502ffa12998aa082cea88cf382730488dcb8b58",
      "2014-09-23 13:06:18",
      0.025,
    ),
  ],
});
