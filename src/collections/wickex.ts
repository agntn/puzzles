import { NamedCollection } from "../core/collection.ts";
import { fact, party, PartyKind, profile } from "../core/parts.ts";
import { wickexYouTube } from "./wickex/youtube.ts";

/** Wickex's puzzle post on r/bitcoinpuzzles. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/1ti0uw/medium_1mbtc_find_the_private_key/";

/** Where Wickex posted the address of the solved GIF puzzle. */
const GIF_SOLVE =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/1thjjq/easy_1mbtc_find_the_private_key_in_this_gif/ce846u3";

/** Wickex's puzzle from the opening night of r/bitcoinpuzzles. */
export class WickexCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "wickex";

  /** Who published the puzzle. */
  static readonly author = party("Wickex", {
    key: "wickex",
    kind: PartyKind.Person,
    about:
      "Solved the first puzzle on r/bitcoinpuzzles in December 2013 and, to keep it fair, posted the second one the same night: hex, a YouTube video, Morse code and a brainwallet.",
    profiles: [profile("reddit", "https://www.reddit.com/user/Wickex/")],
    facts: [
      fact(
        "Solved IAMABananaAMAA's GIF puzzle and posted the address two and a half hours after it went up.",
        GIF_SOLVE,
        { date: "2013-12-23" },
      ),
      fact(
        "Posted the subreddit's second puzzle because solving the first made it only fair to create the next one.",
        THREAD,
        { date: "2013-12-23" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [wickexYouTube];

  /** Builds the canonical collection. */
  constructor() {
    super(WickexCollection.key, WickexCollection.author, WickexCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const wickex = new WickexCollection();
