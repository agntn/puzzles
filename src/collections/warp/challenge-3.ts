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

/** Puzzle `warp/challenge_3`. */
export const warpPuzzleChallenge3 = bitcoinPuzzle({
  id: "warp/challenge_3",
  address: p2pkh("1FpxSs3tsvV8knTgRv2885bE1GyPq1QrvH", "a2a3985813e2b921ba5bcbf838f2160e5ded078b"),
  sourceUrl: "https://keybase.io/warp",
  startedAt: "2013-11-19 20:12:25",
  status: Status.Solved,
  pubkey: uncompressed(
    "04cdf27fe2598b7df25c002f268a7984642b206a54a077e04d8ff8032b0aa2e8b2a8dae0a9f2011f214d9eb57f0c7977fa378bd5ddcb21c90f5311549b5418b199",
  ),
  key: hex("71a1cd20b19496fedbf6ea6184e604f25f4875c8107243793fc630dad177dcb5")
    .wif("5JgLACMfjpYt7ccG5SqJ5DMtrR8Zibe82PqQtEKjHQFeMkapixe")
    .passphrase("LsDmT CrashLogic"),
  prize: 0.5,
  solvedAt: "2013-11-27 15:04:25",
  solveTime: 672720,
  transactions: [
    funding(
      "35f2a2e601277156a9cfc0e02f92d184918714b1bea3a75bcc82d9f6bea848ea",
      "2013-11-19 20:12:25",
      0.5,
    ),
    claim(
      "de0253a758588a5079516299b633d55372ed5ae171ca4688a2f6f0c471ff93ad",
      "2013-11-27 15:04:25",
      0.5,
    ),
  ],
  hints: [
    official(
      "this passphrase is the usernames of two who've posted on the Bitcoin subreddit, separated by a space.",
      "https://keybase.io/warp",
      confirmation(
        "https://web.archive.org/web/20131213023906/https://keybase.io/warp/warp_1.0.6_SHA256_e68d4587b0e2ec34a7b554fbd1ed2d0fedfaeacf3e47fbb6c5403e252348cbfc.html",
        "Wayback capture of the challenge page",
      ),
    ),
  ],
});
