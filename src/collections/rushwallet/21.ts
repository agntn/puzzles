import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/21`. */
export const rushwalletPuzzle21 = bitcoinPuzzle({
  id: "rushwallet/21",
  address: p2pkh("1DXHoGc61UE4x2LLkHfPetrJwcQjyMi9dE", "895c02a38d28ba8f34a8a0baef0c4445682b3bf3"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 21:24:40",
  status: Status.Solved,
  pubkey: uncompressed(
    "0481f959abed78e0c12c2aab725f481d5b3a6d0dbf6ffe215bd3e27261bddce738352d188830d7faacea73213434542c68056d73daa2019cd9c3a4d3075dbb7be7",
  ),
  key: hex("822c57a30037fd4771c354b8f71f93a7b9e3460a2795334eabea2317f84e532e")
    .wif("5JocgUqQg1c6yP9SQ6PSwWoo28BjHiazTVqSdaJCb2fJzW7hyQd")
    .passphrase("Hey try out Kryptokit today"),
  solvedAt: "2014-09-23 13:58:23",
  solveTime: 59623,
  transactions: [
    funding(
      "a78fd1563a9058bec48f669a1acd24dbf9bd3d50dbfd979b0af4bbd81f7f6177",
      "2014-09-22 21:24:40",
      0.025,
    ),
    claim(
      "10862911685dcd04ea8280420d6fc900e18e9fff44da3da0c64c4a8feeac2dbd",
      "2014-09-23 13:58:23",
      0.025,
    ),
  ],
});
