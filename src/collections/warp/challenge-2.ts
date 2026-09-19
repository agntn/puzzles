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

/** Puzzle `warp/challenge_2`. */
export const warpPuzzleChallenge2 = bitcoinPuzzle({
  id: "warp/challenge_2",
  address: p2pkh("1NMjXhB2DW8pbGvd64o9DiqwCF8BTAkJKu", "ea4676574baeba82db43e26421f4113bc389d513"),
  sourceUrl: "https://keybase.io/warp",
  startedAt: "2013-11-19 20:12:25",
  status: Status.Solved,
  pubkey: uncompressed(
    "040ccffff6759ce8bbf62061fa5f57758fc8cca98719de8dfc43da1103ee9b25632323b540ab4692d17db0839865b19ae194b2a553e28442035483925b8c710c1a",
  ),
  key: hex("3a302179184a58ab6267a80fc9b30dba6ead1bf42ec84d8477f21f12f6640570")
    .wif("5JFuv6B2NakNBAdH4aUAsbrNipwA4jZCHfZdXpHdjEpm5YPRNAT")
    .passphrase("hvW"),
  prize: 0.25,
  solvedAt: "2013-11-20 04:40:30",
  solveTime: 30485,
  transactions: [
    funding(
      "e2a23dc3a745a853caf6be317b75912b6f85a618a25602de67708e12894babdf",
      "2013-11-19 20:12:25",
      0.25,
    ),
    claim(
      "60c1b66664cb4ba5135acaa34e38bb1cff077355d9aefe2ab5e7e2af8b7df328",
      "2013-11-20 04:40:30",
      0.25,
    ),
  ],
  hints: [
    official(
      "this passphrase is 3 random alphanumeric characters, such as 'Xa2'.",
      "https://keybase.io/warp",
      confirmation(
        "https://web.archive.org/web/20131213023906/https://keybase.io/warp/warp_1.0.6_SHA256_e68d4587b0e2ec34a7b554fbd1ed2d0fedfaeacf3e47fbb6c5403e252348cbfc.html",
        "Wayback capture of the challenge page",
      ),
    ),
  ],
});
