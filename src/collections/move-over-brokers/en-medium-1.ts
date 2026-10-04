import { funding, official } from "../../core/parts.ts";
import { puzzle } from "../../core/puzzle.ts";

/** The author's retrospective, with the eight English addresses and their difficulty. */
const ARTICLE = "https://kf106.medium.com/everyone-loves-a-treasure-hunt-93885ae8d80a";

/** The hunt announcement at the end of the English book, quoted in floflo777's notebook. */
const ANNOUNCEMENT =
  "https://github.com/floflo777/open-crypto-puzzles/blob/main/2-mid-prizes/keir-finlow-bates-blockchain-book-600ksats/clues/author-posts.md";

/** The first medium English lot, still holding its 200,000 sats. */
export const moveOverBrokersEnMedium1 = puzzle({
  id: "move-over-brokers/en-medium-1",
  chain: "bitcoin",
  address: "17Y9czcbcCz433QXsy1SGQjwLb27BBtLLZ",
  sourceUrl: ARTICLE,
  startedAt: "2020-11-28 16:24:07",
  prize: 0.002,
  hints: [
    official(
      "You hold the source of each and every key in your hands... as long as you have a physical copy, that is. Note that there are plenty of red herrings too.",
      ANNOUNCEMENT,
    ),
    official("In many cases, you'll have to hash the answer three times.", ANNOUNCEMENT),
  ],
  transactions: [
    funding(
      "f26ecab737b701982a7a3d0f9b0ffb3c509225cbbefecc2a4fe2e73758ce8972",
      "2020-11-28 16:24:07",
      0.002,
    ),
  ],
});
