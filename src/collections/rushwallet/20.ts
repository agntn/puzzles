import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/20`. */
export const rushwalletPuzzle20 = bitcoinPuzzle({
  id: "rushwallet/20",
  address: p2pkh("1F49nZxGdLbqKH3TvMnfy9xohZXc8xJBAU", "9a2a57bedcaf2c1097d4615d2acc43eb907385bb"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:32:38",
  status: Status.Solved,
  pubkey: uncompressed(
    "04fdc55c34aa085f649ec5c6fd749aa139cb748f610dfca5b40c7120fd4859371b460caedef96ef2018968dc0c12adacdc58ce2c6cb0addff299c797dbfdaf6a85",
  ),
  key: hex("7758e815ecb5c738e8dccfe55213a5f5b4491c882860352629dde0dd66613f8d")
    .wif("5Jir9XjvcYW5hTug66ToQoWmN8EarSuwGgFVZAEqoMwoyZGYwCU")
    .passphrase("RushWallet Fundraiser by Kryptokit"),
  solvedAt: "2014-09-23 15:57:26",
  solveTime: 69888,
  transactions: [
    funding(
      "1c57279c898ba2deeb520abc8feb84eb3d0135a175656805271be1c199fa67a3",
      "2014-09-22 20:32:38",
      0.025,
    ),
    claim(
      "fcd06a4c7bfe4afb8db8fe4bf0bf95371298622cb432e375d0bd9403866a5fcb",
      "2014-09-23 15:57:26",
      0.025,
    ),
  ],
});
