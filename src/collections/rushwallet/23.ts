import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/23`. */
export const rushwalletPuzzle23 = bitcoinPuzzle({
  id: "rushwallet/23",
  address: p2pkh("1724izW5beNyKGXv4a3zcoTySq8fZoo2RL", "4204477fd856845fd7521e9002af910ff2ef272e"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:40:50",
  status: Status.Solved,
  pubkey: uncompressed(
    "04f5980512adb9a9d8dd7fe5b711b4619cdc16aedccc67d959e64bed57c6d89c68174a52e2f1b83874ac58b80aa25c362e634f431b996ae9a37803cd241d7a882f",
  ),
  key: hex("24fe8073b8b2bf67f7f327e6ecd7ef360fb3c651a18013b3b17cd7a568b08818")
    .wif("5J6aYhZSY26EbZ9Xf6PhoMP8UcCBUa6TghUvGWEfxccDtehxky7")
    .passphrase("seans's outpost seans's outpost"),
  solvedAt: "2014-09-29 20:43:00",
  solveTime: 604930,
  transactions: [
    funding(
      "55ccf3b8b62247922c554ab9d34d2d2092f997002b97fdacbea3f4fc025ad528",
      "2014-09-22 20:40:50",
      0.05,
    ),
    claim(
      "8ff24eb89410c9f76a8ffa290cc098437859e61633b8d5929d42a1227cf96ef5",
      "2014-09-29 20:43:00",
      0.0009,
    ),
  ],
});
