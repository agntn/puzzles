import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/7`. */
export const rushwalletPuzzle7 = bitcoinPuzzle({
  id: "rushwallet/7",
  address: p2pkh("16Y9k4AhDJG43dSGMKu6GAVigAfTH2t96x", "3cbcd24af4baa702dc4145bc01442f302a9fd3e4"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:17:14",
  status: Status.Solved,
  pubkey: uncompressed(
    "047abacd375a5f4687f1db45d28b17fcd431ac4130d135ffa0be3f416645d2c6d166924c4c3537e52cff0527dc0bd09de0dc73ecaf4bdb4ada9f71167db2582e75",
  ),
  key: hex("6196a23ae9b913a15f1676d7c5d535fe594bc91644ed02b95c8a72742ff9a2ad")
    .wif("5JZGM41oXvaFZ4JUNh4AhDFdDdoziPdHsQPuEJBPCMf3Qo6Cc3w")
    .passphrase("New Quiet Keyboard for Enrique"),
  solvedAt: "2014-09-23 13:23:26",
  solveTime: 61572,
  transactions: [
    funding(
      "36f74ab06b156937f242f04f8ce4aae3b7ad28b1cecc393259fbee0a5388b4aa",
      "2014-09-22 20:17:14",
      0.025,
    ),
    claim(
      "6161cf6778dc7a82092cef5a29e4d7bcf52ab86336aa3403bb6a5d3a61ca9a6f",
      "2014-09-23 13:23:26",
      0.025,
    ),
  ],
});
