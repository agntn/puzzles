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

/** Puzzle `warp/warp_challenge_2`. */
export const warpPuzzleWarpChallenge2 = bitcoinPuzzle({
  id: "warp/warp_challenge_2",
  address: p2pkh("1MkupVKiCik9iyfnLrJoZLx9RH4rkF3hnA", "e3b07e2fc4ea14b903c11aee122f7fec19e4a621"),
  sourceUrl: "https://keybase.io/warp",
  startedAt: "2016-02-01 15:19:33",
  status: Status.Expired,
  pubkey: uncompressed(
    "0403a696da2c6243816c8a7c1d98756c8d56e74ac54a79d35ed7c3a9a9eb84d9be11ac016eb926fda6cb58322ac4b6a505fd52c258d70d5e49eac99b1e96a696c1",
  ),
  key: hex("1d0482346095f6cb5791b0d8f2c8d0b6c10f8245d20ecd03933779344ced5025")
    .wif("5J34oCttqfswmkGnX5NWrU19xkZPNu4a2bRJHW2UdiAU7QpTSsN")
    .passphrase("HY4r0uWn")
    .salt("a@b.c"),
  prize: 20,
  solvedAt: "2018-01-03 03:14:39",
  transactions: [
    funding(
      "e12fee70d2b0b308129b9b12d6f95be25617fc4f98c56900034ce466b3113074",
      "2016-02-01 15:19:33",
      10,
    ),
    claim(
      "25d23cf88188258001830a7b7c45fd7c9f43be16ce8f75088810360c55ee9f17",
      "2018-01-03 03:14:39",
      10.0005164,
    ),
  ],
  hints: [
    official(
      "this passphrase is 8 characters long, only alphanumerics. For example, 'b234FEzz'. the salt is a@b.c",
      "https://keybase.io/warp",
      confirmation(
        "https://web.archive.org/web/20160305003531/https://keybase.io/warp/warp_1.0.8_SHA256_5111a723fe008dbf628237023e6f2de72c7953f8bb4265d5c16fc9fd79384b7a.html",
        "Wayback capture of the challenge page",
      ),
    ),
  ],
});
