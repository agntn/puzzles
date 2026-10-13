import {
  assets,
  claim,
  compressed,
  confirmation,
  digest,
  funding,
  official,
  party,
} from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The Coin_Games home page, which lists every week with its prize, word count and state. */
const HOME = "https://coingames6.webnode.page/";

/** The August 2022 Wayback capture of the home page, the oldest one with the puzzle list. */
const HOME_CAPTURE = "https://web.archive.org/web/20220813091533/https://coingames6.webnode.page/";

/** The Webnode CDN folder that still serves the puzzle images. */
const CDN = "https://386758fd16.cbaul-cdnwnd.com/9c493a7ec34929c379f1104e3122787b";

/** The puzzle #1 page, with all six versions of the note and the claim notice. */
const PAGE = "https://coingames6.webnode.page/puzzle1/";

/** Week 1: a skull banknote redrawn five times, then emptied on December 14, 2017. */
export const coinGames1 = puzzle({
  id: "coin-games/1",
  chain: "bitcoin",
  address: "1M9Wim45mRH31YwQX2iAc7if2M6fjxK3vQ",
  sourceUrl: PAGE,
  startedAt: "2017-11-20 04:37:55",
  status: Status.Claimed,
  solvedAt: "2017-12-14 08:13:31",
  solveTime: 2_086_536,
  prize: 0.0000202,
  pubkey: compressed("0331820835233189d48bbb323ec9f086c3d043d28f0258b452c94ad25bf444e152"),
  hints: [
    official(
      "Difficulty: Easy 10 words",
      HOME,
      confirmation(HOME_CAPTURE, "The home page as it stood in August 2022."),
    ),
    official("The Image has now been updated to help solvers out!", PAGE, undefined, {
      date: "2017-12-12",
    }),
  ],
  assets: assets({
    puzzle: "1/puzzle.png",
    hints: [
      "1/version-2.png",
      "1/version-3.png",
      "1/version-4.png",
      "1/version-5.png",
      "1/version-6.png",
    ],
    sourceUrl: PAGE,
    digests: [
      digest(
        "1/puzzle.png",
        "f02084fab4a7a321745154a65711a66e62b1e7002fbe8318e49dd07e898d0674",
        943_023,
        { url: `${CDN}/200000022-157d61677a/BitcoinPuzzlenumber1.png?ph=386758fd16` },
      ),
      digest(
        "1/version-2.png",
        "0797c6da69fd962abdc631cff38c04b5608a66e5dc827deb3adf7c7718b7852d",
        980_336,
        { url: `${CDN}/200000026-dd6b9de644/1UPDATE.png?ph=386758fd16` },
      ),
      digest(
        "1/version-3.png",
        "b0faf86ded13be9a595b4ca76a753b1635890dbf62f362068d4b7f9addf13076",
        949_713,
        { url: `${CDN}/200000027-d28a5d3829/2UPDATE.png?ph=386758fd16` },
      ),
      digest(
        "1/version-4.png",
        "64d74e85cb8bc5a3618155df26e1646059fae105fcc66751ba05907e765b2d9c",
        958_284,
        { url: `${CDN}/200000028-71cfc72c8e/3FINALCLUE.png?ph=386758fd16` },
      ),
      digest(
        "1/version-5.png",
        "03c8f8bd145cbfd402f570d844123268fb9e81477d7394eb94dbfb97eaf66a5e",
        997_751,
        { url: `${CDN}/200000029-a187fa2813/4EXTRA.png?ph=386758fd16` },
      ),
      digest(
        "1/version-6.png",
        "a9bb0cea52319ee301d0d7a7b0dbb7d4d4e75fed2cd892e01d2902e880670b64",
        968_628,
        { url: `${CDN}/200000030-97e3f98dcc/512-3.png?ph=386758fd16` },
      ),
    ],
  }),
  transactions: [
    funding(
      "2a6f631a0a9ee6b0eb82ab99243809c735c285a6c5ee42055db7aaa870b54349",
      "2017-11-20 04:37:55",
      0.0000202,
    ),
    claim(
      "1e2e0f017c15946f44d7f6f19e359fd6aa6c655353c8e094cb431d28de2376c7",
      "2017-12-14 08:13:31",
      0.0000202,
    ),
  ],
  solver: party(undefined, { addresses: ["1N8RZziRx4ahauqd3VcXMfYsCe4HTL2GfJ"] }),
});
