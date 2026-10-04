import {
  answer,
  claim,
  community,
  funding,
  official,
  party,
  technique,
  uncompressed,
} from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The author's retrospective, with the eight English addresses and their difficulty. */
const ARTICLE = "https://kf106.medium.com/everyone-loves-a-treasure-hunt-93885ae8d80a";

/** floflo777's notebook on the hunt: the answers, the recipes and the payouts. */
const SOLUTION =
  "https://github.com/floflo777/open-crypto-puzzles/tree/main/2-mid-prizes/keir-finlow-bates-blockchain-book-600ksats";

/** The hunt announcement at the end of the English book, quoted in floflo777's notebook. */
const ANNOUNCEMENT =
  "https://github.com/floflo777/open-crypto-puzzles/blob/main/2-mid-prizes/keir-finlow-bates-blockchain-book-600ksats/clues/author-posts.md";

/** A Figure 9 bitmap read as key bits. Only the book prints the figure, so no key. */
export const moveOverBrokersEnMedium2 = puzzle({
  id: "move-over-brokers/en-medium-2",
  chain: "bitcoin",
  address: "1QFafw3weoWTRQhiLafRw2eyWbVmES6wfJ",
  sourceUrl: ARTICLE,
  startedAt: "2020-11-28 16:24:07",
  status: Status.Claimed,
  pubkey: uncompressed(
    "045ec26fe27e6915e337cf99f60a1958483b8d449b80a695244d384a84946be68041cf5d406c07a4c289a5eba065da9c4ca37a62fa913762559e2d3a1d2052e8ac",
  ),
  techniques: [technique("binary", SOLUTION), technique("partial-key", SOLUTION)],
  prize: 0.002,
  hints: [
    official(
      "You hold the source of each and every key in your hands... as long as you have a physical copy, that is. Note that there are plenty of red herrings too.",
      ANNOUNCEMENT,
    ),
    official("In many cases, you'll have to hash the answer three times.", ANNOUNCEMENT),
    community(
      "Figure 9 of the book prints a 16 by 16 black and white bitmap.",
      SOLUTION,
      undefined,
      {
        date: "2026-09-01",
        answer: answer(
          "Figure 9's 16-row bitmap read row by row with white cells as 1 bits; the 16th column is not drawn, so its 16 bits are enumerated (65,536 keys) and the uncompressed address is compared. Missing bits 0xb968.",
          SOLUTION,
          { date: "2026-09-01" },
        ),
      },
    ),
  ],
  solvedAt: "2021-01-10 19:48:24",
  solveTime: 3_727_457,
  transactions: [
    funding(
      "f26ecab737b701982a7a3d0f9b0ffb3c509225cbbefecc2a4fe2e73758ce8972",
      "2020-11-28 16:24:07",
      0.002,
    ),
    claim(
      "1c6720389ded6f3d94d717a7630e6d518ee35840fefea135b48e60217605493c",
      "2021-01-10 19:48:24",
      0.00180333,
    ),
  ],
  solver: party(undefined, { addresses: ["1MpCsuvLTWA4Guo3ZjGG1HYNdvTqZP2eW"] }),
});
