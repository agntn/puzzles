import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/14`. */
export const rushwalletPuzzle14 = bitcoinPuzzle({
  id: "rushwallet/14",
  address: p2pkh("146uBhbW8pvwW3HVcqV6MWhRMiAj9jZj7W", "220604c119a6a57f5d88429fbf1e499e10e2d8f0"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:16:50",
  status: Status.Solved,
  pubkey: uncompressed(
    "04df7861cd84fd334f2c456e63c154fc6bab65a1d07b67b765c156e859a3795b82f1bf19d94c2007e73ff99ab657d45e0154a1e50110468d4900161c4b165519c0",
  ),
  key: hex("385ec4f7ddaca0501099f902a540e6e09a2d16c7b76616dd44c5d49204e400b0")
    .wif("5JF7UwA2yQKYkjqiuzWHxFSthGKCJCkpdu86FrBh5TNFhAQZn18")
    .passphrase("the kryptokit hardware wallet is coming soon"),
  solvedAt: "2014-09-23 13:58:23",
  solveTime: 63693,
  transactions: [
    funding(
      "96086d20eb4627b72a91db3b28148499c9431f0478fc75c42ba582b2a6a01112",
      "2014-09-22 20:16:50",
      0.025,
    ),
    claim(
      "348ee174016be54657af3128f5a56b69da33ce621cdb6c9e18d3b50cb028e3ed",
      "2014-09-23 13:58:23",
      0.025,
    ),
  ],
});
