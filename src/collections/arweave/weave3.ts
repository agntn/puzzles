import { arweavePuzzle } from "../../core/puzzle.ts";
import { funding, standard } from "../../core/parts.ts";

/** Puzzle `arweave/weave3`. */
export const arweavePuzzleWeave3 = arweavePuzzle({
  id: "arweave/weave3",
  address: standard("wHP6OPG5GMF5dedo_CD8AAy6x8La-gfI5b5pk65Tx_0"),
  sourceUrl: "https://ur42unm2jhdm.arweave.net/VLJIGuTJewofKx8ad4JYQs93nEuGnkgjrIt_Sd2QPYw",
  startedAt: "2019-05-25 13:07:33",
  prize: 1000,
  transactions: [
    funding("hTB5Ouv5nY11pQiGFXCJQZxNOkVlgPAAJ9IYSRu8v0E", "2019-05-25 13:07:33", 250),
    funding("_Aa5au3qzhCSIPxj5RfLkF_eSUuxAcnqoWY3PeKTaRg", "2019-05-27 08:30:39", 500),
    funding("7-sWojFc0sG3mTr34YGBGssYDvXjOPZf-xik8v1Ct24", "2019-08-28 14:09:38", 250),
  ],
});
