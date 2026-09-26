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

/** Puzzle `warp/challenge-4`. */
export const warpPuzzleChallenge4 = bitcoinPuzzle({
  id: "warp/challenge-4",
  address: p2pkh("1GXXH7FbY7nCJDRc72SMyYykgtEUi5GxfR", "aa4fa3e2be1fbf59edd4bc3702a08f715251e823"),
  sourceUrl: "https://keybase.io/warp",
  startedAt: "2013-11-19 20:12:25",
  status: Status.Solved,
  pubkey: uncompressed(
    "048bf325a507144fafb185fedaeb0e8440eb062e40fe30fad92d88fee42bc9ba199eab8ce1b044f55bd8fc9c71fcef4f291ef8e41add26d63de4be09238d6ef007",
  ),
  key: hex("8c7a26059ad4db5c774e944a1a8438f60a6de7456ca3a868ab010efddae532e5")
    .wif("5Jt9t5tBrh1Mi1LC3s6EXCCk8S81nNX7kga3xr1B2HECGioPy2r")
    .passphrase("petecoper"),
  prize: 1,
  solvedAt: "2013-11-20 01:23:39",
  solveTime: 18674,
  transactions: [
    funding(
      "f17e84dce6c193690b07e8ea220e90370246d8deb846707dc11d032c688b43fd",
      "2013-11-19 20:12:25",
      1,
    ),
    claim(
      "921bf858098acb6a8ad4d4184fc7654e68cc2e2f4f6ebe7c59cec4e8540e1b12",
      "2013-11-20 01:23:39",
      1,
    ),
  ],
  hints: [
    official(
      "This passphrase is the username of someone in the Hacker News top 100 karma list as of November 19, 2013. However, we dropped 2 characters from his or her username.",
      "https://keybase.io/warp",
      confirmation(
        "https://web.archive.org/web/20131213023906/https://keybase.io/warp/warp_1.0.6_SHA256_e68d4587b0e2ec34a7b554fbd1ed2d0fedfaeacf3e47fbb6c5403e252348cbfc.html",
        "Wayback capture of the challenge page",
      ),
    ),
  ],
});
