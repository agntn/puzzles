import { NumericCollection } from "../core/collection.ts";
import { grycoinBlock1 } from "./grycoin/1.ts";
import { grycoinBlock2 } from "./grycoin/2.ts";
import { QuizchainCollection } from "./quizchain.ts";

/** The Grycoin chain, AoiNakamoto's last blocks on r/Grycoin, addressed by block number. */
export class GrycoinCollection extends NumericCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "grycoin";

  /** Who published the blocks: the same account as both Quizchain runs. */
  static readonly author = QuizchainCollection.author;

  /** Every puzzle in this collection. */
  static readonly puzzles = [grycoinBlock1, grycoinBlock2];

  /** Builds the canonical collection. */
  constructor() {
    super(GrycoinCollection.key, GrycoinCollection.author, GrycoinCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const grycoin = new GrycoinCollection();
