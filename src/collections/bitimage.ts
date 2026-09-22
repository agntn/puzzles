import { NamedCollection } from "../core/collection.ts";
import { fact, party, PartyKind, profile } from "../core/parts.ts";
import { bitimagePuzzleKitten } from "./bitimage/kitten.ts";
import { bitimagePuzzleKittenPassphrase } from "./bitimage/kitten-passphrase.ts";

/** Keys derived from image files as BIP39 entropy. */
export class BitimageCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "bitimage";

  /** Who published the puzzles. */
  static readonly author = party("Corey Phillips", {
    key: "corey-phillips",
    kind: PartyKind.Person,
    aliases: ["coreylphillips"],
    about:
      "Bitcoin mobile developer who turned photographs into BIP39 seeds with BitImage and funded two of them.",
    profiles: [
      profile("github", "https://github.com/coreyphillips"),
      profile("twitter", "https://x.com/coreylphillips"),
      profile("medium", "https://corey-lyle-phillips.medium.com/"),
    ],
    facts: [
      fact(
        "The GitHub bio reads Software Developer at Synonym.to, with pinned work on the Bitkit wallet and its Lightning bindings.",
        "https://github.com/coreyphillips",
      ),
      fact(
        "Published BitImage in July 2019 as part one of a series on turning photos into private keys and addresses.",
        "https://corey-lyle-phillips.medium.com/part-1-3-turn-your-photos-into-bitcoin-private-keys-addresses-57669771cf7a",
        { date: "2019-07-09" },
      ),
      fact(
        "Ran a separate audio puzzle in January 2020. Its prize was swept four days later.",
        "https://corey-lyle-phillips.medium.com/a-bitcoin-audio-puzzle-61174b9849ce",
        { date: "2020-01-05" },
      ),
      fact(
        "Also wrote Moonshine, a React Native Bitcoin and Litecoin wallet first released as Bitbip.",
        "https://github.com/coreyphillips/moonshine",
      ),
    ],
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
