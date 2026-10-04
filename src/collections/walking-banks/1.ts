import { compressed, funding } from "../../core/parts.ts";
import { puzzle } from "../../core/puzzle.ts";

/** The 700,000 sats lot at m/0/1 of the treasure wallet's published xpub. */
export const walkingBanks1 = puzzle({
  id: "walking-banks/1",
  chain: "bitcoin",
  address: "bc1q4qc24xk5cehc4t7vr264zldsms2kmxf86jqjau",
  sourceUrl: "https://web.archive.org/web/20250716082759/https://www.walkingbanks.com/",
  startedAt: "2024-09-05 13:49:07",
  prize: 0.007,
  pubkey: compressed("0345a988db0b34ab48693b9d525ff227d98c67e8986c0664c1d9412f111e5afa3b"),
  transactions: [
    funding(
      "ad436eaaa66e31b59b763049dc6d59bb213cc3b9910b80b2e7424720e39b1533",
      "2024-09-05 13:49:07",
      0.007,
    ),
  ],
});
