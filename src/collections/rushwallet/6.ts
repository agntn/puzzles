import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/6`. */
export const rushwalletPuzzle6 = bitcoinPuzzle({
  id: "rushwallet/6",
  address: p2pkh("1MFUVBapEBURA3jT9TGNCJQyAChqbYrvvf", "de1f4880fe69ef588334a94ecf31558287fadcea"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:17:14",
  status: Status.Solved,
  pubkey: uncompressed(
    "04b02b822cd3d224ce405e0682fccde6805cad430252e4d29fad73ed752b56d946587072d39c8cc0f1693e0dd3be23c53ba01d3921603f1c72a6a29bc4abb5e22a",
  ),
  key: hex("305c10eb89edbd0e35d7359362ed18d3ee5b0df7fd6a6c400002dbfeefe2e950")
    .wif("5JBas2qrscDAMPao26kM9amYP8JYpooWYEKy5kYpptfgNErVjy8")
    .passphrase("this is a rushwallet brainwallet"),
  solvedAt: "2014-09-23 13:23:26",
  solveTime: 61572,
  transactions: [
    funding(
      "b758f391a4dc2b0ebc16667b209348389019981d97582e28aa69f41064330c93",
      "2014-09-22 20:17:14",
      0.025,
    ),
    claim(
      "62bf890257f4c71691c78ed289b1259983939e2582210ce6623819a7102d941a",
      "2014-09-23 13:23:26",
      0.025,
    ),
  ],
});
