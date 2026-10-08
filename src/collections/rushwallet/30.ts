import { puzzle } from "../../core/puzzle.ts";
import { decrease, funding, increase, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/30`. */
export const rushwalletPuzzle30 = puzzle({
  id: "rushwallet/30",
  chain: "bitcoin",
  address: "13Q8hJqagtd77ojTJcEZPjTz2sBFSsYxyj",
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:48:06",
  pubkey: uncompressed(
    "04b28d687ff46211d3cf75021db818b86f70addcb42ccedf53f4280926bd2a7fba0784eb6b8d23313c3c85ea1df284cf2844371ca499fcb48ba8a26df651c29a85",
  ),
  transactions: [
    funding(
      "87fec08c933c04fe5b60c14cc8e5a7dabe10774380e06458c88f1d194e06828c",
      "2014-09-22 20:48:06",
      1,
    ),
    decrease(
      "73950f9a1f0e1fa512194b753a6e2d836154ff407293bedea4fcd4b22f109653",
      "2015-03-25 21:33:55",
      0.9999,
    ),
    increase(
      "64278e7126e83831f91e84fa27f2bc6e88442d2dfa0361dd52a7c9abf0852cbf",
      "2015-04-24 18:28:44",
      0.01,
    ),
  ],
});
