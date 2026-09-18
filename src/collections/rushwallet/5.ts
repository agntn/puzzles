import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/5`. */
export const rushwalletPuzzle5 = bitcoinPuzzle({
  id: "rushwallet/5",
  address: p2pkh("1Djjzr1bCyys1mkEDf9qDCX9kngRv7MzQM", "8bb6df46035958a8ef62b0cadcce2201fde053fb"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:17:14",
  status: Status.Solved,
  pubkey: uncompressed(
    "048ba996e8476dee155eddb754da1549954ccfd940404061d9abe788c1b8bfa6f933be0a169620ccd865d8600e0395dc2a54e0b544f7c4f5d1adc2e05b159a8657",
  ),
  key: hex("c0184e16d5bd2c4988897f4c03bd50eacec5d5df1ab8be127ff44b72b5060baa")
    .wif("5KGtPWkqLuEGYnq3nQsbWiP21a4yBN42ujXTub6nxwbhFSQZWc1")
    .passphrase("Bitcoin wallet and tools built right into your browser."),
  solvedAt: "2014-09-23 15:12:09",
  solveTime: 68095,
  transactions: [
    funding(
      "30afdc625f46bf9c2d6a73cbdf1fe9caffbd8b28555bfea13dbea9d37b37bd16",
      "2014-09-22 20:17:14",
      0.025,
    ),
    claim(
      "136c4bec93999054e3f4df0097a1debee8f5d7a27eb86f6968178aef8a18b4bf",
      "2014-09-23 15:12:09",
      0.025,
    ),
  ],
});
