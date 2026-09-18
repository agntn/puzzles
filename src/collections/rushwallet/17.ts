import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/17`. */
export const rushwalletPuzzle17 = bitcoinPuzzle({
  id: "rushwallet/17",
  address: p2pkh("16tGKq48tGq3Td1wcDoQRuWtPtXoEfZpBC", "408aa2a4c5df589979a83316fbafff4da68eb1a3"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:32:38",
  status: Status.Solved,
  pubkey: uncompressed(
    "0458e33c33b9eec4d9c4da0080c1cf40d4a7a8aac4c3d3ce80f429491a4e3fca9980c3a10106bd0686097880cb8162f6a8835c0fdc91e7af0eb9aef46743513003",
  ),
  key: hex("4dfc9787478140cb8b57f18e51ea7ce0acc032f52d27d4245573d6cfd10212c8")
    .wif("5JQdeTxtRErwuxpQbGfJFWz1ECw3BR4h12zJ5EiPQzw9xusScLw")
    .passphrase("Dmitri Nancy Enrique"),
  solvedAt: "2014-09-25 20:16:57",
  solveTime: 258259,
  transactions: [
    funding(
      "982f472395906eb47afd40a265e663bca81ef5bbbee12672bcb3cb307a994f27",
      "2014-09-22 20:32:38",
      0.15,
    ),
    claim(
      "59ae3210bce2a6703572940b1fa651d526c2c30d0b82c6be671e80cd1c84eaff",
      "2014-09-25 20:16:57",
      0.15,
    ),
  ],
});
