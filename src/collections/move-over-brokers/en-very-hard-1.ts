import { claim, funding, official, party, uncompressed } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The author's retrospective, with the eight English addresses and their difficulty. */
const ARTICLE = "https://kf106.medium.com/everyone-loves-a-treasure-hunt-93885ae8d80a";

/** The hunt announcement at the end of the English book, quoted in floflo777's notebook. */
const ANNOUNCEMENT =
  "https://github.com/floflo777/open-crypto-puzzles/blob/main/2-mid-prizes/keir-finlow-bates-blockchain-book-600ksats/clues/author-posts.md";

/** The first very hard English lot, swept within ten weeks by someone who never said how. */
export const moveOverBrokersEnVeryHard1 = puzzle({
  id: "move-over-brokers/en-very-hard-1",
  chain: "bitcoin",
  address: "1KZei2D5yz3UJ59LvXsC1Y9y4ktSgcnVwz",
  sourceUrl: ARTICLE,
  startedAt: "2020-11-28 16:24:07",
  status: Status.Claimed,
  pubkey: uncompressed(
    "04bab3bfe808849e76fc8ae6bebfe88398c3d6b50e26673fbccc3bc4f523dd241b7baef2c00de9b2c58dca0d38c7a0e429e3976c53ef0c6c95c65a86d3f4864fa5",
  ),
  prize: 0.002,
  hints: [
    official(
      "You hold the source of each and every key in your hands... as long as you have a physical copy, that is. Note that there are plenty of red herrings too.",
      ANNOUNCEMENT,
    ),
    official("In many cases, you'll have to hash the answer three times.", ANNOUNCEMENT),
  ],
  solvedAt: "2021-02-05 08:08:47",
  solveTime: 5_931_880,
  transactions: [
    funding(
      "f26ecab737b701982a7a3d0f9b0ffb3c509225cbbefecc2a4fe2e73758ce8972",
      "2020-11-28 16:24:07",
      0.002,
    ),
    claim(
      "cfe513ddbb400fa9a7477ef96891c14172b981b26e1b8114bc7012a3864a3c89",
      "2021-02-05 08:08:47",
      0.0017,
    ),
  ],
  solver: party(undefined, { addresses: ["1F37VZHQVzuwZu3nHGTTEZUYFojebd6wrA"] }),
});
