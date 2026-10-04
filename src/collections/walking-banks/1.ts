import { compressed, funding } from "../../core/parts.ts";
import { puzzle } from "../../core/puzzle.ts";

/** The 100,000 sats lot at m/0/0 of the treasure wallet's published xpub. */
export const walkingBanks1 = puzzle({
  id: "walking-banks/1",
  chain: "bitcoin",
  address: "bc1qxy4tf0s4n7x9w24rawf9qsxh2hyljrmvyrhwzt",
  sourceUrl: "https://web.archive.org/web/20250716082759/https://www.walkingbanks.com/",
  startedAt: "2024-09-05 13:35:50",
  prize: 0.001,
  pubkey: compressed("027b26f0973f7656d7405ebdc2d7500d855aee346ff4518d61507050254703d8a3"),
  transactions: [
    funding(
      "70efe537a71ccbf9fabb603210d732bc3e8da3300976d7a130e7b1766d6e2830",
      "2024-09-05 13:35:50",
      0.001,
    ),
  ],
});
