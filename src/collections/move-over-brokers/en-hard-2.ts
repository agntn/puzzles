import {
  answer,
  claim,
  community,
  fact,
  funding,
  hex,
  official,
  party,
  PartyKind,
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

/** No answer string at all: the key is the XOR of seven hashes in Figure 10. */
export const moveOverBrokersEnHard2 = puzzle({
  id: "move-over-brokers/en-hard-2",
  chain: "bitcoin",
  address: "161YgNX2NrCzGunWvoV1hN3DuzWeuovBK3",
  sourceUrl: ARTICLE,
  startedAt: "2020-11-28 16:24:07",
  status: Status.Solved,
  pubkey: uncompressed(
    "04563a1dcc9bd3f03c403bef3f80b6258838f2395c9838bfa38ce758b65f4559be2775fd89def3115f475fdd3469e4f0dbcc9635871fa4130337aa565b2b04aaa5",
  ),
  key: hex("9dd0f77d3cc6746cdfe779de61499a88ba4a7fc6a53f90dc276a0c2826679be8").wif(
    "5K1nnZxtT1kDxbzjkwK6GUYBWApcUMDpLVpKNgSvpGxLYhruRTB",
  ),
  techniques: [technique("xor", SOLUTION)],
  prize: 0.002,
  hints: [
    official(
      "You hold the source of each and every key in your hands... as long as you have a physical copy, that is. Note that there are plenty of red herrings too.",
      ANNOUNCEMENT,
    ),
    official("In many cases, you'll have to hash the answer three times.", ANNOUNCEMENT),
    community(
      'Figure 10, "A hash function-generated one-time password pad", prints 7 SHA-256 values built from a deliberately altered pangram.',
      SOLUTION,
      undefined,
      {
        date: "2026-08-16",
        answer: answer(
          "XOR the 7 printed 256-bit hex values together, use the 32-byte result directly as the private key, uncompressed public key.",
          SOLUTION,
          { date: "2026-08-16" },
        ),
      },
    ),
  ],
  solvedAt: "2026-06-25 17:55:05",
  solveTime: 175_829_458,
  transactions: [
    funding(
      "f26ecab737b701982a7a3d0f9b0ffb3c509225cbbefecc2a4fe2e73758ce8972",
      "2020-11-28 16:24:07",
      0.002,
    ),
    claim(
      "c46c70fb04a2faeebde24057b22a547da7b309fd33b74b3d77181943a02b45d0",
      "2026-06-25 17:55:05",
      0.001996,
    ),
  ],
  solver: party("floflo777", {
    key: "floflo777",
    kind: PartyKind.Person,
    addresses: ["bc1qax0hsnwnxl7393awtc3hsy0ftm6tg4tyk2nfja"],
    facts: [
      fact(
        "Took the caption of Figure 10 literally, XORed its seven hashes into the key and published it with the payout.",
        SOLUTION,
        { date: "2026-08-16" },
      ),
    ],
  }),
});
