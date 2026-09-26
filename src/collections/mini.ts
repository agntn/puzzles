import { NumericCollection } from "../core/collection.ts";
import { fact, party, PartyKind, profile } from "../core/parts.ts";
import { mini120 } from "./mini/120.ts";
import { mini125 } from "./mini/125.ts";
import { mini130 } from "./mini/130.ts";

/**
 * RetiredCoder's mini-puzzles, each built on a solved Bitcoin puzzle and paying out the Bitcoin
 * Cash still on that puzzle's address. Addressed by the number of the puzzle it is built on.
 */
export class MiniCollection extends NumericCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "mini";

  /** Who posted the mini-puzzles: the solver of b1000/120, 125, 130 and 135. */
  static readonly author = party("RetiredCoder", {
    key: "retired-coder",
    kind: PartyKind.Person,
    about:
      "Bitcoin puzzle solver and author of RCKangaroo who gave away the Bitcoin Cash left on three solved puzzle addresses as mini-puzzles on Bitcointalk.",
    profiles: [
      profile("github", "https://github.com/RetiredC"),
      profile("bitcointalk", "https://bitcointalk.org/index.php?action=profile;u=3657819"),
    ],
    facts: [
      fact(
        "Registered the bitcointalk account on October 5, 2024.",
        "https://bitcointalk.org/index.php?action=profile;u=3657819",
        { date: "2024-10-05" },
      ),
      fact(
        "Wrote that the mini-puzzles are meant to be easy, so everyone with minimal skills can solve them, and that #67 and #135 are there for anyone who wants hard ones.",
        "https://bitcointalk.org/index.php?topic=5518896.msg64741927#msg64741927",
        { date: "2024-11-15" },
      ),
      fact(
        "Explained the #130 mini-puzzle in the thread after its winner never showed up there.",
        "https://bitcointalk.org/index.php?topic=5522785.msg64850761#msg64850761",
        { date: "2024-12-15" },
      ),
    ],
  });

  /** Every puzzle in this collection, oldest first. */
  static readonly puzzles = [mini120, mini125, mini130];

  /** Builds the canonical collection. */
  constructor() {
    super(MiniCollection.key, MiniCollection.author, MiniCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const mini = new MiniCollection();
