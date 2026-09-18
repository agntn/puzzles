import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/3`. */
export const rushwalletPuzzle3 = bitcoinPuzzle({
  id: "rushwallet/3",
  address: p2pkh("1NWexsN7HZjNbmZcpQ8b37LiMSJ3Trvuz5", "ebf664fc424c230f94ae587df554c189834b0ad5"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:17:14",
  status: Status.Solved,
  pubkey: uncompressed(
    "04456ec2ed4201faf57edb6b513caaa0e1a88c160b1e0677c4fb2eb3fe7501617b0a0a723e92bf0740aabae6b5bd2b3115f7b65220787a685715624a798b5d24f6",
  ),
  key: hex("9807a135993ae881d0dc9179ad73a36c6618707a74e25504af0551ab645da0fc")
    .wif("5JyEyivg11jUGPp5R9GE93HmN28rxkXQusBhNTtg9p1PsHWcp3n")
    .passphrase("decentral.ca D.Nakamoto"),
  solvedAt: "2014-09-23 16:40:13",
  solveTime: 73379,
  transactions: [
    funding(
      "8c8111bc62d562bc445cf97112ac77e5a2894430349d5e9e92e771a6e7f9bd29",
      "2014-09-22 20:17:14",
      0.025,
    ),
    claim(
      "5668307acaa269b7dbc12ed870866fae290367442e8abdf2f2c594e723da747b",
      "2014-09-23 16:40:13",
      0.025,
    ),
  ],
});
