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

/** Puzzle `warp/challenge_1`. */
export const warpPuzzleChallenge1 = bitcoinPuzzle({
  id: "warp/challenge_1",
  address: p2pkh("1JKb1617p68H5MPkoNaMtaJCqKDU3h8qSn", "bdfe0236c752bbf8610b47c57b8c8592230dc575"),
  sourceUrl: "https://keybase.io/warp",
  startedAt: "2013-11-19 20:12:25",
  status: Status.Solved,
  pubkey: uncompressed(
    "045f751d820a69524eb71d48ddc6a231ba019b1461f58b0266cbbec617f9e80c6e573582b37014ce7ba7eaf9031265c5f022d8cb286f2194344f207eaa44bb51af",
  ),
  key: hex("20f5df9cba8251e90a66d3aa1ca2849b12eaca135abb837671ac4a2bc2014e2b")
    .wif("5J4oWdwA5mSCP4GVWF237zgYK4h1csD2PfrmK3uh3YcRFSWZ2H1")
    .passphrase("Je"),
  prize: 0.1,
  solvedAt: "2013-11-20 03:52:13",
  solveTime: 27588,
  transactions: [
    funding(
      "66e4f6fdf399ce95804347fc4bdbd9e35de7d4044e2cfcb3b51d44db9522f00b",
      "2013-11-19 20:12:25",
      0.1,
    ),
    claim(
      "1384234046c03e8dfcb868aa68b82df29078dcdda01e243fe006e4e0793b8cd8",
      "2013-11-20 03:52:13",
      0.1,
    ),
  ],
  hints: [
    official(
      "this passphrase is 2 random alphanumeric characters, such as 'X9'.",
      "https://keybase.io/warp",
      confirmation(
        "https://web.archive.org/web/20131213023906/https://keybase.io/warp/warp_1.0.6_SHA256_e68d4587b0e2ec34a7b554fbd1ed2d0fedfaeacf3e47fbb6c5403e252348cbfc.html",
        "Wayback capture of the challenge page",
      ),
    ),
  ],
});
