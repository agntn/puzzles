import {
  answer,
  claim,
  community,
  funding,
  hex,
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

/** Sherlock Holmes's address hashed three times. Swept in 2022, decoded in 2026. */
export const moveOverBrokersEnEasy1 = puzzle({
  id: "move-over-brokers/en-easy-1",
  chain: "bitcoin",
  address: "14aFhno96fkt7knLWMDQ4j8yh8v5hBF4n1",
  sourceUrl: ARTICLE,
  startedAt: "2020-11-28 16:24:07",
  status: Status.Solved,
  pubkey: uncompressed(
    "0479b1b086e28ab7c7f98efb60103b5e0cc01cee15f037dcc616dd49ffc17f9f2516d784f8414813247abeaefe6cd6388df2463cf5df99618aacc9e9c6cb219f1b",
  ),
  key: hex("72048596fda6013a976c22ac4d0b1dbc29a3ca624f4740a64b195ad10f4e1b89")
    .wif("5JgW1WrxCgC4275UqHQfTVpdnyEPJDaaSf76VPCC7Q6KX14Cunc")
    .passphrase("221B Baker Street")
    .derived(),
  techniques: [technique("triple-sha256-brainwallet", SOLUTION)],
  prize: 0.002,
  hints: [
    official(
      "You hold the source of each and every key in your hands... as long as you have a physical copy, that is. Note that there are plenty of red herrings too.",
      ANNOUNCEMENT,
    ),
    official("In many cases, you'll have to hash the answer three times.", ANNOUNCEMENT),
    community(
      'The book plants the number 221 with a "check it on your calculator" nudge in one chapter and titles a section "Elementary, my dear Watson" in another.',
      SOLUTION,
      undefined,
      {
        date: "2026-08-16",
        answer: answer("221B Baker Street", SOLUTION, { date: "2026-08-16" }),
      },
    ),
  ],
  solvedAt: "2022-01-15 06:48:31",
  solveTime: 35_648_664,
  transactions: [
    funding(
      "f26ecab737b701982a7a3d0f9b0ffb3c509225cbbefecc2a4fe2e73758ce8972",
      "2020-11-28 16:24:07",
      0.002,
    ),
    claim(
      "5a4eb010ab4aa23a3946d50a602276551e160042862e95c793e384c5d8cf8011",
      "2022-01-15 06:48:31",
      0.0019888,
    ),
  ],
  solver: party(undefined, { addresses: ["19HBFLhjcoi49jNVe3r7T555rfzPGpeXN3"] }),
});
