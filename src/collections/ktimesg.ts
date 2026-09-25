import { NamedCollection } from "../core/collection.ts";
import { fact, party, PartyKind, profile } from "../core/parts.ts";
import { kTimesG80Bit } from "./ktimesg/80-bit.ts";

/** Where kTimesG announced the rules. */
const ANNOUNCEMENT = "https://bitcointalk.org/index.php?topic=1306983.msg64639847#msg64639847";

/** Where kTimesG looked back on the claim. */
const RECAP = "https://bitcointalk.org/index.php?topic=1306983.msg64695204#msg64695204";

/** kTimesG's key cracking challenges from Bitcointalk. */
export class KTimesGCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "ktimesg";

  /** Who published the puzzles. */
  static readonly author = party("kTimesG", {
    key: "ktimesg",
    kind: PartyKind.Person,
    about:
      "Writes on Bitcointalk about cracking Bitcoin keys. In 2024 offered 0.005 BTC to whoever cracked a key with 80 unknown bits before its transaction confirmed. Someone did, 39 minutes in.",
    profiles: [
      profile("bitcointalk", "https://bitcointalk.org/index.php?action=profile;u=3610370"),
    ],
    facts: [
      fact(
        "Announced the 80-bit challenge two weeks early. Only asked the winner to say how they broke the key.",
        ANNOUNCEMENT,
        { date: "2024-10-16" },
      ),
      fact(
        "Was disappointed it took 39 minutes to replace the spend. With a real 80-bit puzzle, nobody gets 40.",
        RECAP,
        { date: "2024-11-02" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [kTimesG80Bit];

  /** Builds the canonical collection. */
  constructor() {
    super(KTimesGCollection.key, KTimesGCollection.author, KTimesGCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const kTimesG = new KTimesGCollection();
