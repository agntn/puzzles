import { NamedCollection } from "../core/collection.ts";
import { party, profile } from "../core/parts.ts";
import { arweavePuzzleWeave1 } from "./arweave/weave1.ts";
import { arweavePuzzleWeave2 } from "./arweave/weave2.ts";
import { arweavePuzzleWeave3 } from "./arweave/weave3.ts";
import { arweavePuzzleWeave4 } from "./arweave/weave4.ts";
import { arweavePuzzleWeave5 } from "./arweave/weave5.ts";
import { arweavePuzzleWeave7 } from "./arweave/weave7.ts";
import { arweavePuzzleWeave8 } from "./arweave/weave8.ts";
import { arweavePuzzleWeave9 } from "./arweave/weave9.ts";
import { arweavePuzzleWeave10 } from "./arweave/weave10.ts";
import { arweavePuzzleWeave11 } from "./arweave/weave11.ts";
import { arweavePuzzleWeave12 } from "./arweave/weave12.ts";
import { arweavePuzzleWeave13 } from "./arweave/weave13.ts";

/** Tiamat's Arweave bounties. */
export class ArweaveCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "arweave";

  /** Who published the puzzles. */
  static readonly author = party("Tiamat", {
    profiles: [
      profile("website", "https://chronobot.io/"),
      profile("twitter", "https://twitter.com/ArweaveP"),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [
    arweavePuzzleWeave1,
    arweavePuzzleWeave2,
    arweavePuzzleWeave3,
    arweavePuzzleWeave4,
    arweavePuzzleWeave5,
    arweavePuzzleWeave7,
    arweavePuzzleWeave8,
    arweavePuzzleWeave9,
    arweavePuzzleWeave10,
    arweavePuzzleWeave11,
    arweavePuzzleWeave12,
    arweavePuzzleWeave13,
  ];

  /** Builds the canonical collection. */
  constructor() {
    super(ArweaveCollection.key, ArweaveCollection.author, ArweaveCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const arweave = new ArweaveCollection();
