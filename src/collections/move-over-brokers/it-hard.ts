import {
  answer,
  claim,
  community,
  fact,
  funding,
  hex,
  party,
  PartyKind,
  technique,
  uncompressed,
} from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The author's retrospective, with the four Italian addresses and their difficulty. */
const ARTICLE = "https://kf106.medium.com/everyone-loves-a-treasure-hunt-93885ae8d80a";

/** floflo777's notebook on the hunt: the answers, the recipes and the payouts. */
const SOLUTION =
  "https://github.com/floflo777/open-crypto-puzzles/tree/main/2-mid-prizes/keir-finlow-bates-blockchain-book-600ksats";

/** Four cities from the Italian acknowledgements, hashed three times. */
export const moveOverBrokersItHard = puzzle({
  id: "move-over-brokers/it-hard",
  chain: "bitcoin",
  address: "1QExGvuieS9MvuKC3R1qjp6jGTVcqisTDj",
  sourceUrl: ARTICLE,
  startedAt: "2021-09-11 09:28:09",
  status: Status.Solved,
  pubkey: uncompressed(
    "0415baad0594ce555fc1f3a695cfcc34be55a4c83b312f48092addbdd17ead7602e53844e722f666be11757ba37f63c5734d276ec26e362e933e922646890654cf",
  ),
  key: hex("b99d16572661d00fd7a18a6b4ed6e7311eb930798c790b573c8942ca4b12e37f")
    .wif("5KE2qELS41zdVG1e6mu3wNE2hJCejty1f1GAvCCrgGyuX57ERQt")
    .passphrase("Genova Firenze Bologna Brindisi"),
  techniques: [technique("triple-sha256-brainwallet", SOLUTION)],
  prize: 0.002,
  hints: [
    community(
      'A paragraph found only in the Italian front matter thanks three people for a trip and closes "Non sarei riuscito a farlo senza voi tre."',
      SOLUTION,
      undefined,
      {
        date: "2026-08-16",
        answer: answer("Genova Firenze Bologna Brindisi", SOLUTION, { date: "2026-08-16" }),
      },
    ),
  ],
  solvedAt: "2026-07-03 23:28:02",
  solveTime: 151_768_793,
  transactions: [
    funding(
      "42919c00a64661e20b8af5719c64d58339e6e492ad21f07f4d38548768cbb23e",
      "2021-09-11 09:28:09",
      0.002,
    ),
    claim(
      "ad999c5837e67b4d566516a70344b352c4c688e1a0781eed739be3aad3afb20c",
      "2026-07-03 23:28:02",
      0.001996,
    ),
  ],
  solver: party("floflo777", {
    key: "floflo777",
    kind: PartyKind.Person,
    addresses: ["bc1qax0hsnwnxl7393awtc3hsy0ftm6tg4tyk2nfja"],
    facts: [
      fact(
        "Read the three people thanked in the Italian acknowledgements as the three rounds of SHA-256, hashed the four cities of their trip and published the key with the payout.",
        SOLUTION,
        { date: "2026-08-16" },
      ),
    ],
  }),
});
