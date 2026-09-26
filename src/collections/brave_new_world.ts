import { SingletonCollection } from "../core/collection.ts";
import {
  assets,
  fact,
  funding,
  increase,
  p2pkh,
  party,
  PartyKind,
  profile,
} from "../core/parts.ts";
import { bitcoinPuzzle } from "../core/puzzle.ts";

/** The post: a title and one picture, with the prize address along its left edge. */
const THREAD = "https://www.reddit.com/user/stsh_n/comments/j79zvj/bitcoin_puzzle_2000/";

/** The picture the post links to. The file under `assets/` is what Reddit serves for it. */
const PICTURE = "https://i.redd.it/n1x7g8ceaur51.png";

/**
 * A collage titled "Welcome to the Brave New World": the Statue of Liberty, George Floyd, Trump
 * against Biden, surveillance cameras, lines of runes and "Find the seed phrase" behind it all. The
 * address is written up the left edge. The post has a title and nothing else, so the picture is the
 * whole puzzle.
 */
export const braveNewWorldPuzzle = bitcoinPuzzle({
  id: "brave_new_world",
  address: p2pkh("1KfZGvwZxsvSmemoCmEV75uqcNzYBHjkHZ", "bd031e54cde2a3189fd59bc49f731367a1779eb0"),
  sourceUrl: THREAD,
  startedAt: "2020-10-08 09:25:30",
  prize: 0.2,
  transactions: [
    funding(
      "fcee21d44ee94c09869947c74b61669bf928358e9c2d1699fb075bb6ebf5d043",
      "2020-05-10 08:01:46",
      0.2,
    ),
    increase(
      "a490266f12466f91c00546a4b744b5faea70835794b5b182d84e47e4294a33ee",
      "2023-10-25 01:55:34",
      0.00001,
    ),
    increase(
      "6ca136b078c61f530e3c7eb46eed0a23785840294fc59ef006df26e26f88fb53",
      "2024-12-13 08:42:55",
      0.001,
    ),
    increase(
      "51b778b00ca5dc676e99da96545e5c1ae6cf68c4ca79d59879e77facac64a251",
      "2025-05-09 23:02:54",
      0.00000557,
    ),
    increase(
      "6d1f46d1913c45de1cd515a9cdc4de64ff2abfc19102e2cf23840bb5e944f8f4",
      "2025-06-02 05:48:21",
      0.00005727,
    ),
  ],
  assets: assets({ puzzle: "puzzle.png", sourceUrl: PICTURE }),
});

/** Brave New World, one picture puzzle by stsh_n. */
export class BraveNewWorldCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "brave_new_world";

  /** Who published the puzzle. */
  static readonly author = party("stsh_n", {
    key: "stsh-n",
    kind: PartyKind.Person,
    about:
      "Reddit account that posted one picture puzzle to its own profile in October 2020, with 0.2 BTC on the address it shows.",
    profiles: [profile("reddit", "https://www.reddit.com/user/stsh_n/")],
    facts: [
      fact(
        "Posted Bitcoin puzzle (2000$) on their own Reddit profile, a title and a picture with no text.",
        THREAD,
        { date: "2020-10-08" },
      ),
      fact(
        "Wrote the prize address up the left edge of the picture, beside the Statue of Liberty.",
        PICTURE,
        { date: "2020-10-08" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [braveNewWorldPuzzle];

  /** Builds the canonical collection. */
  constructor() {
    super(
      BraveNewWorldCollection.key,
      BraveNewWorldCollection.author,
      BraveNewWorldCollection.puzzles,
    );
  }
}

/** Canonical collection instance. */
export const braveNewWorld = new BraveNewWorldCollection();
