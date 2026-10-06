import { SingletonCollection } from "../core/collection.ts";
import {
  assets,
  community,
  digest,
  fact,
  funding,
  official,
  party,
  PartyKind,
  profile,
  technique,
} from "../core/parts.ts";
import { puzzle } from "../core/puzzle.ts";

/** The pinned post with the back of the card, the last of four versions within four minutes. */
const CARD = "https://x.com/schoolofbitcoin/status/1860193190491619457";

/** The March 2025 repost of the same card, the bytes the Stacker News thread later linked. */
const REPOST = "https://x.com/schoolofbitcoin/status/1897907304072171821";

/**
 * A comment in the Stacker News thread about the card, by its item id.
 *
 * @param {string} id - The item id Stacker News gives the comment.
 * @returns {string} The comment's permalink.
 */
function comment(id: string): string {
  return `https://stacker.news/items/${id}`;
}

/** A business card whose back hides every clue to 1,000,000 sats, shown at 2000 followers. */
export const businessCard = puzzle({
  id: "school-of-bitcoin",
  chain: "bitcoin",
  address: "bc1qcsdfkaqgy9ux668vmzflzqsyg0qtspncymt5ed",
  sourceUrl: CARD,
  startedAt: "2024-11-23 05:22:14",
  prize: 0.01,
  techniques: [technique("morse", comment("908393")), technique("binary", comment("908556"))],
  hints: [
    official(
      "Hidden on this card... is every clue needed to find a treasure of... 1 Million Sats",
      CARD,
      undefined,
      { date: "2024-11-23" },
    ),
    official(
      "at 2000 followers I said I would share the back of my business card... on which I have hidden all the clues you need to find and claim 1 MILLION sats",
      CARD,
      undefined,
      { date: "2024-11-23" },
    ),
    official(
      "Oh, and when I get to 10,000 followers if it hasn't been claimed I will reveal a big clue to the treasure!",
      CARD,
      undefined,
      { date: "2024-11-23" },
    ),
    official("I've designed it to be a.i proof... prove me wrong", REPOST, undefined, {
      date: "2025-03-07",
    }),
    official(
      "You need a touchscreen to zoom... either phone, tablet or laptop/desktop with touchscreen",
      comment("921244"),
      undefined,
      { date: "2025-03-22" },
    ),
    community(
      "The morse code translates to ZEROBONEZEROONEZERO FINGZ KNEE DID 4D A DRESS 2Z PRIES. 0b1010 is binary for decimal 10, so 10 things needed for the address to see prize",
      comment("908393"),
      undefined,
      { date: "2025-03-09" },
    ),
    community(
      "Wingdings, what a font! But it is the black characters you want :)",
      comment("908489"),
      undefined,
      { date: "2025-03-09" },
    ),
    community(
      'Decoding it to ASCII characters gives: "You found a clue to the hidden treasure of 1 FULL BITCOIN! :) abstract". First seed word is abstract.',
      comment("908556"),
      undefined,
      { date: "2025-03-09" },
    ),
  ],
  transactions: [
    funding(
      "bddcb314564eb66215c7aa27a1aad126d5f51240db073adf5eb72382b0044eda",
      "2024-10-12 07:23:20",
      0.01,
    ),
  ],
  assets: assets({
    puzzle: "puzzle.jpg",
    sourceUrl: CARD,
    digests: [
      digest(
        "puzzle.jpg",
        "cc58d233151dfed747368a452c08651b5cd2e308a1180407c8c1c503bd22af21",
        1081755,
        { url: "https://pbs.twimg.com/media/GdC6pxMagAAy0ri.jpg?name=orig" },
      ),
    ],
  }),
});

/** School of Bitcoin's business card, one puzzle for 1,000,000 sats. */
export class SchoolOfBitcoinCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "school-of-bitcoin";

  /** Who published the card. */
  static readonly author = party("School of Bitcoin", {
    key: "school-of-bitcoin",
    kind: PartyKind.Organization,
    about:
      "Free Bitcoin course at schoolofbitcoin.com that hid 1,000,000 sats behind the back of its own business card.",
    profiles: [
      profile("website", "https://schoolofbitcoin.com/"),
      profile("twitter", "https://x.com/schoolofbitcoin"),
    ],
    facts: [
      fact(
        "Promised the back of its business card at 2000 followers on X and shared it then, with every clue needed to find and claim 1 million sats.",
        CARD,
        { date: "2024-11-23" },
      ),
      fact(
        "Posted the card again in March 2025 and dared Grok to solve a hunt it called a.i proof.",
        REPOST,
        { date: "2025-03-07" },
      ),
      fact(
        "Answered the Stacker News thread about the card anonymously, signed M with the schoolofbitcoin.com link, and told the players they had got further than anyone so far.",
        comment("908965"),
        { date: "2025-03-10" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [businessCard];

  /** Builds the canonical collection. */
  constructor() {
    super(
      SchoolOfBitcoinCollection.key,
      SchoolOfBitcoinCollection.author,
      SchoolOfBitcoinCollection.puzzles,
    );
  }
}

/** Canonical collection instance. */
export const schoolOfBitcoin = new SchoolOfBitcoinCollection();
