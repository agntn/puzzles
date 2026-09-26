import { SingletonCollection } from "../core/collection.ts";
import { assets, fact, funding, increase, official, p2pkh, party, profile } from "../core/parts.ts";
import { bitcoinPuzzle } from "../core/puzzle.ts";

/** The article: an essay on hiding seed phrases in prose, with the prize address at the end. */
const ARTICLE =
  "https://medium.com/coinmonks/securing-bitcoin-seed-phrases-in-stories-d8eb43a02254";

/** The Wayback capture from the day of publication. `puzzle.txt` is its text, paragraph by paragraph. */
const CAPTURE = `https://web.archive.org/web/20190211203952/${ARTICLE}`;

/** The account's responses page as captured in 2020, under its second display name. */
const RESPONSES =
  "https://web.archive.org/web/20200924153242/https://medium.com/@onesourgrape/responses";

/**
 * Securing Wealth in Poetry: an essay on "trithemian seeds", seed phrases hidden in a story and
 * picked out by phone numbers or GPS digits. It closes by saying the reader has read every word
 * needed to open a wallet with .03 BTC, then prints that wallet's address.
 */
export const wealthInPoetryPuzzle = bitcoinPuzzle({
  id: "wealth-in-poetry",
  address: p2pkh("1K4ezpLybootYF23TM4a8Y4NyP7auysnRo", "c6233aeb3a50a70b82fcd88d69b5f1a3ec6e355a"),
  sourceUrl: ARTICLE,
  startedAt: "2019-02-11 15:34:04",
  prize: 0.03050269,
  hints: [
    official(
      "The beauty of trithemian seeds is that they hide in plain sight. If you’ve read this far, you’ve read every word required to access a wallet with .03 BTC. Good luck!",
      ARTICLE,
    ),
  ],
  transactions: [
    funding(
      "0a9ddd15961d507d77cd281c230151ea5980be24e4a22ceb38f3c78737f9f60c",
      "2019-02-10 14:47:11",
      0.03050269,
    ),
    increase(
      "b3c9d8cc52234419642edf6824b1d004e0873432cd4b9e127bf557cfc9990dcf",
      "2019-04-08 17:37:36",
      0.00074361,
    ),
  ],
  assets: assets({ puzzle: "puzzle.txt", sourceUrl: CAPTURE }),
});

/** Securing Wealth in Poetry, one Medium article by OneSourGrape. */
export class WealthInPoetryCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "wealth-in-poetry";

  /** Who published the puzzle. */
  static readonly author = party("OneSourGrape", {
    key: "onesourgrape",
    aliases: ["Sharon & Philippe", "Trithemius"],
    about:
      "Medium account that published one essay on hiding seed phrases in stories in February 2019, with 0.03 BTC on a wallet hidden in its own text.",
    profiles: [profile("medium", "https://medium.com/@onesourgrape")],
    facts: [
      fact(
        "Published Securing Wealth in Poetry in Coinmonks, an essay on trithemian seeds that ends with a .03 BTC wallet hidden in the essay itself.",
        ARTICLE,
        { date: "2019-02-11" },
      ),
      fact(
        "Promised in the article to donate the contents of the wallet to GiveDirectly.org/refugees if nobody accessed it by the end of 2020.",
        ARTICLE,
        { date: "2019-02-11" },
      ),
      fact(
        'Went by Sharon & Philippe in 2020, with the bio "Designer, Miner, Grape.", and the two replies to readers on the article show under that name.',
        RESPONSES,
      ),
      fact("Signs the same article as Trithemius today.", ARTICLE),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [wealthInPoetryPuzzle];

  /** Builds the canonical collection. */
  constructor() {
    super(
      WealthInPoetryCollection.key,
      WealthInPoetryCollection.author,
      WealthInPoetryCollection.puzzles,
    );
  }
}

/** Canonical collection instance. */
export const wealthInPoetry = new WealthInPoetryCollection();
