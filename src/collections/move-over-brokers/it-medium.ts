import {
  answer,
  claim,
  community,
  compressed,
  fact,
  funding,
  hex,
  party,
  PartyKind,
} from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The author's retrospective, with the four Italian addresses and their difficulty. */
const ARTICLE = "https://kf106.medium.com/everyone-loves-a-treasure-hunt-93885ae8d80a";

/** floflo777's notebook on the hunt: the answers, the recipes and the payouts. */
const SOLUTION =
  "https://github.com/floflo777/open-crypto-puzzles/tree/main/2-mid-prizes/keir-finlow-bates-blockchain-book-600ksats";

/** Twelve English words that only work once translated into the Italian BIP39 list. */
export const moveOverBrokersItMedium = puzzle({
  id: "move-over-brokers/it-medium",
  chain: "bitcoin",
  address: "1Q78hDeaHXQbuCSQxG1uPAc4V3jsuVUG9r",
  sourceUrl: ARTICLE,
  startedAt: "2021-09-11 09:28:09",
  status: Status.Solved,
  pubkey: compressed("029a2fb6e89407276d8fd5baf13ba81bfa51f59db78917693a6d7879f844fa5baf"),
  key: hex("578df2fef081d6c5430a5a815515412930ee5d6cf6b0f92aab04a4a121067ecd")
    .wif("Kz9uTuc4bo9FczbmcuAeuXqeV9AHQnpV8U56dKeepoKxnqccDboF")
    .seed(
      "orologio snervato mugnaio enzima scienza glutine spargere valletta diametro pianta totano civetta",
      "m/44'/0'/0'/0/0",
    ),
  prize: 0.002,
  hints: [
    community(
      "The Italian edition prints 12 English words in its entropy passage, in the spot where the English edition prints a mnemonic.",
      SOLUTION,
      undefined,
      {
        date: "2026-08-16",
        answer: answer(
          "orologio snervato mugnaio enzima scienza glutine spargere valletta diametro pianta totano civetta",
          SOLUTION,
          { date: "2026-08-16" },
        ),
      },
    ),
  ],
  solvedAt: "2026-07-01 20:46:46",
  solveTime: 151_586_317,
  transactions: [
    funding(
      "42919c00a64661e20b8af5719c64d58339e6e492ad21f07f4d38548768cbb23e",
      "2021-09-11 09:28:09",
      0.002,
    ),
    claim(
      "914a825138f943fc357b5a026b607b3c62bf67d5997043761711aaeabf5cab49",
      "2026-07-01 20:46:46",
      0.001996,
    ),
  ],
  solver: party("floflo777", {
    key: "floflo777",
    kind: PartyKind.Person,
    addresses: ["bc1qax0hsnwnxl7393awtc3hsy0ftm6tg4tyk2nfja"],
    facts: [
      fact(
        "Translated the twelve words into the Italian BIP39 list, kept the one of 64 spellings that derives the address and published the key with the payout.",
        SOLUTION,
        { date: "2026-08-16" },
      ),
    ],
  }),
});
