import { NamedCollection } from "../core/collection.ts";
import { party, profile } from "../core/parts.ts";
import { bitimagePuzzleKitten } from "./bitimage/kitten.ts";
import { bitimagePuzzleKittenPassphrase } from "./bitimage/kitten-passphrase.ts";

/** Keys derived from image files as BIP39 entropy. */
export class BitimageCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "bitimage";

  /** Who published the puzzles. */
  static readonly author = party("Corey Phillips", {
    profiles: [profile("github", "https://github.com/coreyphillips")],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [bitimagePuzzleKitten, bitimagePuzzleKittenPassphrase];

  /** Builds the canonical collection. */
  constructor() {
    super(BitimageCollection.key, BitimageCollection.author, BitimageCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const bitimage = new BitimageCollection();
