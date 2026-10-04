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

/** The paperback's ISBN hashed three times, and the first lot anyone claimed. */
export const moveOverBrokersEnEasy2 = puzzle({
  id: "move-over-brokers/en-easy-2",
  chain: "bitcoin",
  address: "14utGQn5GdfPvUrHNLAwTmmP99QpXm9mg6",
  sourceUrl: ARTICLE,
  startedAt: "2020-11-28 16:24:07",
  status: Status.Solved,
  pubkey: uncompressed(
    "040714c4e552c597bc72db8686acd2666b0928e179386254e81a3a64abc6016a2e91eb4b814485c9e9534d18b668f7a22f0628675354707dfde9afca96a7fe5a44",
  ),
  key: hex("7c3130229397839e7cb6a1ecb3fc5036368ff85eb2a5ab9ea7bd01c126511ab4")
    .wif("5JkyuL9emDc3QNyMG1MhfPy9r4G9QGnCsqNrCuQFQA1nxMsSafm")
    .passphrase("9781688289970")
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
      'The book signposts it twice, in the Merkle-tree analogy ("something similar to an ISBN number") and in the "familiar numbers" figure that shows a supermarket barcode.',
      SOLUTION,
      undefined,
      {
        date: "2026-09-01",
        answer: answer("9781688289970", SOLUTION, { date: "2026-09-01" }),
      },
    ),
  ],
  solvedAt: "2021-01-04 21:33:35",
  solveTime: 3_215_368,
  transactions: [
    funding(
      "f26ecab737b701982a7a3d0f9b0ffb3c509225cbbefecc2a4fe2e73758ce8972",
      "2020-11-28 16:24:07",
      0.002,
    ),
    claim(
      "99212513b13d58dfa745e93d82195d75b666cbc6ea2d84ed995599f2913d7506",
      "2021-01-04 21:33:35",
      0.00184862,
    ),
  ],
  solver: party(undefined, { addresses: ["bc1qgmgffahyllcnstppt4h645dj6kwkk8v9rsg7zg"] }),
});
