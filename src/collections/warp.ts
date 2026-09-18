import { NamedCollection } from "../core/collection.ts";
import { party, profile } from "../core/parts.ts";
import { warpPuzzleChallenge1 } from "./warp/challenge-1.ts";
import { warpPuzzleChallenge2 } from "./warp/challenge-2.ts";
import { warpPuzzleChallenge3 } from "./warp/challenge-3.ts";
import { warpPuzzleChallenge4 } from "./warp/challenge-4.ts";
import { warpPuzzleWarpChallenge1 } from "./warp/warp-challenge-1.ts";
import { warpPuzzleWarpChallenge2 } from "./warp/warp-challenge-2.ts";

/** Keybase WarpWallet challenges. */
export class WarpCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "warp";

  /** Who published the puzzles. */
  static readonly author = party("Keybase", {
    profiles: [
      profile("github", "https://github.com/keybase/warpwallet"),
      profile("twitter", "https://twitter.com/maxtaco"),
      profile("twitter", "https://twitter.com/malgorithms"),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [
    warpPuzzleChallenge1,
    warpPuzzleChallenge2,
    warpPuzzleChallenge3,
    warpPuzzleChallenge4,
    warpPuzzleWarpChallenge1,
    warpPuzzleWarpChallenge2,
  ];

  /** Builds the canonical collection. */
  constructor() {
    super(WarpCollection.key, WarpCollection.author, WarpCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const warp = new WarpCollection();
