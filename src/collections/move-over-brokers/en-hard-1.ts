import {
  answer,
  claim,
  community,
  compressed,
  fact,
  funding,
  hex,
  official,
  party,
  PartyKind,
  technique,
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

/** A printed 12-word phrase with its last word broken on purpose, fixed by floflo777. */
export const moveOverBrokersEnHard1 = puzzle({
  id: "move-over-brokers/en-hard-1",
  chain: "bitcoin",
  address: "181rPpfdUGFg4fVEdhDZEfDbBSqgigtoZR",
  sourceUrl: ARTICLE,
  startedAt: "2020-11-28 16:24:07",
  status: Status.Solved,
  pubkey: compressed("02b1208312e746964111987da259e19c1af25ebd417c6df0f0d35342043031f05b"),
  key: hex("bb7431f0773cdef6bce0483556b4ad90ec85e4ea4a7d2aad0529b0d571b8bffb")
    .wif("L3W6ZhE2uqHg4e1yrj6vUZTvykYaiMSg1VNyD8CfVTy1zkfVKzcj")
    .seed(
      "carpet baby bicycle betray shift approve barrel phrase measure prevent image brain",
      "m/44'/0'/0'/0/0",
    ),
  techniques: [technique("partial-key", SOLUTION)],
  prize: 0.002,
  hints: [
    official(
      "You hold the source of each and every key in your hands... as long as you have a physical copy, that is. Note that there are plenty of red herrings too.",
      ANNOUNCEMENT,
    ),
    official("In many cases, you'll have to hash the answer three times.", ANNOUNCEMENT),
    community(
      'The book prints a 12-word phrase whose twelfth word, "brand", fails the BIP39 checksum.',
      SOLUTION,
      undefined,
      {
        date: "2026-08-16",
        answer: answer(
          "carpet baby bicycle betray shift approve barrel phrase measure prevent image brain",
          SOLUTION,
          { date: "2026-08-16" },
        ),
      },
    ),
  ],
  solvedAt: "2026-06-17 22:51:34",
  solveTime: 175_156_047,
  transactions: [
    funding(
      "f26ecab737b701982a7a3d0f9b0ffb3c509225cbbefecc2a4fe2e73758ce8972",
      "2020-11-28 16:24:07",
      0.002,
    ),
    claim(
      "b6e064aa8fde1153c342e2f7d98bce09e004bef5ac8db8f0138601289ceae69a",
      "2026-06-17 22:51:34",
      0.00199622,
    ),
  ],
  solver: party("floflo777", {
    key: "floflo777",
    kind: PartyKind.Person,
    addresses: ["bc1qax0hsnwnxl7393awtc3hsy0ftm6tg4tyk2nfja"],
    facts: [
      fact(
        "Swapped the book's broken twelfth word for brain, the one word that fixes the checksum, and published the key with the payout.",
        SOLUTION,
        { date: "2026-08-16" },
      ),
    ],
  }),
});
