import { NamedCollection } from "../core/collection.ts";
import { fact, party, PartyKind, profile } from "../core/parts.ts";
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
    key: "tiamat",
    kind: PartyKind.Person,
    aliases: ["ArweaveP"],
    about:
      "Pseudonymous programmer behind the Arweave Puzzle Weave series and the Chronobot.io node monitor. Self-described as based in France. No other name known.",
    profiles: [
      profile("website", "https://chronobot.io/"),
      profile("twitter", "https://twitter.com/ArweaveP"),
    ],
    facts: [
      fact(
        "Told Arweave's Community Spotlight interview: country France, occupation programmer, watching the Arweave project since early 2018.",
        "https://arweave.medium.com/community-spotlight-meeting-tiamat-e484655b25e0",
        { date: "2019-10-10" },
      ),
      fact(
        "Built chronobot.io alone, because nothing public showed how Arweave nodes were doing at the time.",
        "https://arweave.medium.com/community-spotlight-meeting-tiamat-e484655b25e0",
        { date: "2019-10-10" },
      ),
      fact(
        "Names tangible puzzles like Hanayama's and a Bitcoin puzzle on Reddit as the inspiration for the weaves, and hosts them on the permaweb for its immutability.",
        "https://arweave.medium.com/community-spotlight-meeting-tiamat-e484655b25e0",
        { date: "2019-10-10" },
      ),
      fact(
        "Answered whether more puzzles would come with: Maybe, if I get ideas.",
        "https://arweave.medium.com/community-spotlight-meeting-tiamat-e484655b25e0",
        { date: "2019-10-10" },
      ),
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
