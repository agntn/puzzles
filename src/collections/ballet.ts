import { NamedCollection } from "../core/collection.ts";
import { party, profile } from "../core/parts.ts";
import { balletPuzzleAA007448 } from "./ballet/aa007448.ts";
import { balletPuzzleAA009926 } from "./ballet/aa009926.ts";
import { balletPuzzleAA012381 } from "./ballet/aa012381.ts";

/** Bobby Lee's Ballet Crypto physical wallet puzzles. */
export class BalletCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "ballet";

  /** Who published the puzzles. */
  static readonly author = party("Bobby Lee", {
    addresses: ["bc1q8car4m7afzx46m2kuhe5xv2ztvc98mk3glyccx"],
    profiles: [profile("twitter", "https://x.com/bobbyclee")],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [balletPuzzleAA007448, balletPuzzleAA009926, balletPuzzleAA012381];

  /** Builds the canonical collection. */
  constructor() {
    super(BalletCollection.key, BalletCollection.author, BalletCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const ballet = new BalletCollection();
