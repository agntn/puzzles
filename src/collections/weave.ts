import { NumericCollection } from "../core/collection.ts";
import { fact, party, PartyKind, profile } from "../core/parts.ts";
import { weave1 } from "./weave/1.ts";
import { weave2 } from "./weave/2.ts";
import { weave3 } from "./weave/3.ts";
import { weave4 } from "./weave/4.ts";
import { weave5 } from "./weave/5.ts";
import { weave7 } from "./weave/7.ts";
import { weave8 } from "./weave/8.ts";
import { weave9 } from "./weave/9.ts";
import { weave10 } from "./weave/10.ts";
import { weave11 } from "./weave/11.ts";
import { weave12 } from "./weave/12.ts";
import { weave13 } from "./weave/13.ts";

/** Tiamat's Puzzle Weave series, keyed by the number in each page's title. */
export class WeaveCollection extends NumericCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "weave";

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
    weave1,
    weave2,
    weave3,
    weave4,
    weave5,
    weave7,
    weave8,
    weave9,
    weave10,
    weave11,
    weave12,
    weave13,
  ];

  /** Builds the canonical collection. */
  constructor() {
    super(WeaveCollection.key, WeaveCollection.author, WeaveCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const weave = new WeaveCollection();
