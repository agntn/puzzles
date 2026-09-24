import { NamedCollection } from "../core/collection.ts";
import { fact, party, PartyKind, profile } from "../core/parts.ts";
import { iAmABananaAmaaCaesar } from "./iamabananaamaa/caesar.ts";
import { iAmABananaAmaaGif } from "./iamabananaamaa/gif.ts";

/** The welcome post of r/bitcoinpuzzles. */
const WELCOME =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/1thi7z/meta_welcome_to_rbitcoinpuzzles/";

/** Where the author told r/Bitcoin about the new subreddit. */
const ANNOUNCEMENT = "https://www.reddit.com/r/Bitcoin/comments/1thjlz/";

/** IAMABananaAMAA's puzzles from the opening days of r/bitcoinpuzzles. */
export class IAmABananaAmaaCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "iamabananaamaa";

  /** Who published the puzzles. */
  static readonly author = party("IAMABananaAMAA", {
    key: "iamabananaamaa",
    kind: PartyKind.Person,
    about:
      "Started r/bitcoinpuzzles in December 2013 and put a puzzle up the same evening: a GIF with 1 mBTC inside. Marked it easy. Took that back within the hour.",
    profiles: [profile("reddit", "https://www.reddit.com/user/IAMABananaAMAA/")],
    facts: [
      fact(
        "Opened r/bitcoinpuzzles with a welcome post: hide a private key in a video, image or text, and put at least 1 mBTC on it.",
        WELCOME,
        { date: "2013-12-22" },
      ),
      fact(
        "Announced the subreddit on r/Bitcoin a minute after posting the GIF puzzle.",
        ANNOUNCEMENT,
        { date: "2013-12-22" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [iAmABananaAmaaGif, iAmABananaAmaaCaesar];

  /** Builds the canonical collection. */
  constructor() {
    super(
      IAmABananaAmaaCollection.key,
      IAmABananaAmaaCollection.author,
      IAmABananaAmaaCollection.puzzles,
    );
  }
}

/** Canonical collection instance. */
export const iAmABananaAmaa = new IAmABananaAmaaCollection();
