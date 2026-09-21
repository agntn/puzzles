import { NamedCollection } from "../core/collection.ts";
import { party, profile } from "../core/parts.ts";
import { torchedH34r7s } from "./coin_artist/torched-h34r7s.ts";

/** Public art puzzles by coin_artist. */
export class CoinArtistCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "coin_artist";

  /** The painter collaborated with Rhea Myers on the encoding. */
  static readonly author = party("coin_artist", {
    profiles: [profile("twitter", "https://x.com/coin_artist")],
  });

  /** The final painting, not the earlier stages of the hunt. */
  static readonly puzzles = [torchedH34r7s];

  /** Builds the canonical collection. */
  constructor() {
    super(CoinArtistCollection.key, CoinArtistCollection.author, CoinArtistCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const coinArtist = new CoinArtistCollection();
