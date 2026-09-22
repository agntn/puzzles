import { SingletonCollection } from "../core/collection.ts";
import {
  confirmation,
  decrease,
  fact,
  funding,
  increase,
  official,
  party,
  PartyKind,
  profile,
  standard,
} from "../core/parts.ts";
import { ethereumPuzzle } from "../core/puzzle.ts";

/**
 * The 10 ETH challenge: a twelve-word seed phrase split in half between a YouTube video and the
 * blog post it links to. The author still holds the key and spends from the wallet himself, so a
 * falling balance is not a solve.
 */
export const mineshopPuzzle = ethereumPuzzle({
  id: "mineshop",
  address: standard("0x9C2F44EFAd0c1E852a09dF9939e6DaF061140CaF"),
  sourceUrl: "https://www.youtube.com/watch?v=w4mpiuBP_aY",
  startedAt: "2020-02-12 13:17:25",
  prize: 8.612541554256945,
  hints: [
    official(
      "12 wallet seed words- 6 are hidden in this video (description, tags, title,video basically could be anywhere in this video) 6.words are hidden in original post. This task will unlock wallet to claim 10 eth.",
      "https://www.youtube.com/watch?v=w4mpiuBP_aY",
      confirmation(
        "https://mineshop.eu/blog/mineshop-blog-tutorials/crypto-pumping-hardcore-research-portfolio-update-how-are-we-doing",
        "The companion post states the same split: six words in the video, six in the post.",
      ),
      { date: "2020-02-12" },
    ),
  ],
  transactions: [
    funding(
      "0xa0c970e0eacc199d3d8a617af84182861b886958fd4416399e9a7191f9dcfb70",
      "2020-02-12 13:17:25",
      10,
    ),
    decrease(
      "0xcf21ccdc94b490435909056531d165ad26eb78b8a2c7ad585376cc5febca0d1a",
      "2021-05-05 10:10:38",
      0.1,
    ),
    decrease(
      "0xd5fa39886433eed6bb2d18f3670ef881a9c7437768070ec3fc1749e5e89f8d7d",
      "2021-05-10 11:14:31",
      0.1,
    ),
    decrease(
      "0x751a87f5a2434a8a359e806fa446cf9873956a73e8c13e2de947fe0cd586c368",
      "2021-05-30 08:24:54",
      0.066,
    ),
    increase(
      "0x16e05bf1d527b82e1a08b100c7255d9512ac2f989a05a6aec43112fb3bb34adb",
      "2021-12-10 10:04:34",
      0.00005,
    ),
    decrease(
      "0x459acd3020f1b6ba8b3123a44aa62df802c31641ad5424ecb3a34b2db0482c2b",
      "2024-01-08 12:38:59",
      0.2218436091293082,
    ),
    decrease(
      "0xd53379648d1eadcd779d4546dd877bce6c0ce976777ebe6feaa372df3b9d841e",
      "2024-01-08 12:39:23",
      0.22170392770678327,
    ),
    decrease(
      "0x5ecca9595fa278b7cc348ceecd6bd784be3c13540ece7be9bde4cd611cd243de",
      "2024-02-09 15:57:23",
      0.4006859743881525,
    ),
    increase(
      "0xe5e71ab1a3c08c3936926c8b64bff40d4c5db41f228057a1dabab56eb258553c",
      "2024-02-16 13:51:59",
      0.000505,
    ),
    decrease(
      "0x3131dd70cd075e62d2d790e920f2049b7bb25d2640c8ecf534257aed01aa3134",
      "2024-06-04 09:53:47",
      0.2669856254939234,
    ),
    increase(
      "0xf2debb3bcfd55e1af49593c5ee2e4e88c9f9f48ea6176618361d98b0a6617a7e",
      "2024-06-04 09:58:11",
      0.000026698,
    ),
    increase(
      "0xe84fa359e4a901ed3555faf749c27710101ab124bc4395cbbeffe077d953f816",
      "2026-07-30 09:09:47",
      0.000011,
    ),
  ],
});

/** The 10 ETH challenge, one puzzle by Guntis Vitolins. */
export class MineshopCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "mineshop";

  /** Who published the puzzles. */
  static readonly author = party("Guntis Vitolins", {
    key: "guntis-vitolins",
    kind: PartyKind.Person,
    about:
      "Founder and managing director of Mineshop.eu, an ASIC miner shop in Ireland, and the YouTuber who buried a 10 ETH seed in a video.",
    profiles: [
      profile("website", "https://mineshop.eu"),
      profile("youtube", "https://www.youtube.com/@GuntisVitolins"),
      profile("twitter", "https://x.com/GuntisVitolins"),
    ],
    facts: [
      fact(
        "Mineshop.eu lists him as Managing Director and says it was founded in 2016 with headquarters in Ireland.",
        "https://mineshop.eu/about-us",
      ),
      fact(
        "The shop says it has sold more than 90,000 miners to customers in 67 countries since 2016.",
        "https://mineshop.eu/about-us",
      ),
      fact(
        "Video descriptions on the channel keep repeating the rules: six seed words in the challenge video, six in the original post, word 12 is a tropical bird, word 1 is Netherlands.",
        "https://www.youtube.com/watch?v=EOBMmJ8tY0E",
        { date: "2024-11-24" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [mineshopPuzzle];

  /** Builds the canonical collection. */
  constructor() {
    super(MineshopCollection.key, MineshopCollection.author, MineshopCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const mineshop = new MineshopCollection();
