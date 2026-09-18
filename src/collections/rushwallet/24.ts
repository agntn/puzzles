import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/24`. */
export const rushwalletPuzzle24 = bitcoinPuzzle({
  id: "rushwallet/24",
  address: p2pkh("18oFx6mSd3YeywSnXLNpqgG7XdY63JUTnP", "55887e8dd8a2eed87de2d58af089e3069c298c7f"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:40:50",
  status: Status.Solved,
  pubkey: uncompressed(
    "04666f17c0d0e0357da1e7c9f8d0f8e42c201dd202d59249b8527a31d73eec5e30feee4f9aaf0456a4e26162287d9e7fe51b1ed99f2b61295ac30d893545453422",
  ),
  key: hex("809893892074b92fbb501182cbf462396e52823002a1c6cc8df6e78ad124f5a5")
    .wif("5JnvPntAhvg5CZbhSsNVfEtnzj1z1UxneRRtg91u4VNMPyEEizi")
    .passphrase("seansoutpost.com seansoutpost.com"),
  solvedAt: "2014-09-23 19:51:42",
  solveTime: 83452,
  transactions: [
    funding(
      "ee55db336839aebc8d5091a75352fb00f03631812653a030a8a0e0984e96bfb2",
      "2014-09-22 20:40:50",
      0.025,
    ),
    claim(
      "ca8bcdcf3a7a67dd76fd00959a40108291787151c3bbc482fb7c30b6e649ab1c",
      "2014-09-23 19:51:42",
      0.0009,
    ),
  ],
});
