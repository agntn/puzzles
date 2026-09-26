import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import {
  claim,
  confirmation,
  funding,
  hex,
  official,
  p2pkh,
  uncompressed,
} from "../../core/parts.ts";

/** Puzzle `warp/warp-challenge-1`. */
export const warpPuzzleWarpChallenge1 = bitcoinPuzzle({
  id: "warp/warp-challenge-1",
  address: p2pkh("1AdU3EcimMFN7JLJtceSyrmFYE3gF5ZnGj", "699ead63fb2da9733786d47e4cd62609a33d7bb6"),
  sourceUrl: "https://keybase.io/warp",
  startedAt: "2013-11-19 20:12:25",
  status: Status.Expired,
  pubkey: uncompressed(
    "041c133e9f41e13c3c31b78fca62355cfcb9f38493d0d9b0449a93401e791de1e0a0e0dc4a37800b64005b4fa85c620e3207fda131f75ce7b7662f74be86a455b0",
  ),
  key: hex("a5117f7ea870b4b606f4c1877829f00dc744000605aa6571ae1695f9a8f638ef")
    .wif("5K4z2kZZxxMZ4Tp6F8gqRTdcTezKdZSxVmRWtPthtDCtNbo4qnB")
    .passphrase("PuACRv0R"),
  prize: 20,
  solvedAt: "2016-01-31 01:19:41",
  transactions: [
    funding(
      "d99ef316fb267491a5f34f8ce35c5083df1a643a850f6b23470263d6e07a2b6b",
      "2013-11-19 20:12:25",
      10,
    ),
    claim(
      "a96d09a4de56f144e95dd2184edd4e53a6beaec9887d14eb63a25aa8e1e456c9",
      "2016-01-31 01:19:41",
      10.001116,
    ),
  ],
  hints: [
    official(
      "this passphrase is 8 characters long, only alphanumerics. For example, 'b234FEzz'.",
      "https://keybase.io/warp",
      confirmation(
        "https://web.archive.org/web/20131213023906/https://keybase.io/warp/warp_1.0.6_SHA256_e68d4587b0e2ec34a7b554fbd1ed2d0fedfaeacf3e47fbb6c5403e252348cbfc.html",
        "Wayback capture of the challenge page",
      ),
    ),
  ],
});
