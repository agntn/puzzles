import { NumericCollection } from "../core/collection.ts";
import { fact, party, PartyKind, profile } from "../core/parts.ts";
import { mini1 } from "./mini/1.ts";
import { mini2 } from "./mini/2.ts";
import { mini3 } from "./mini/3.ts";
import { mini4 } from "./mini/4.ts";
import { mini5 } from "./mini/5.ts";
import { mini6 } from "./mini/6.ts";
import { mini7 } from "./mini/7.ts";

/**
 * RetiredCoder's mini-puzzles, numbered as the author numbered them. Four are built on a solved
 * Bitcoin puzzle and pay out the Bitcoin Cash still on that puzzle's address; #4 to #6 put 0.01 BTC
 * on a fresh key.
 */
export class MiniCollection extends NumericCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "mini";

  /** Who posted the mini-puzzles: the solver of b1000/120, 125, 130 and 135. */
  static readonly author = party("RetiredCoder", {
    key: "retired-coder",
    kind: PartyKind.Person,
    about:
      "Bitcoin puzzle solver and author of RCKangaroo who posted seven mini-puzzles on Bitcointalk: the Bitcoin Cash left on four solved puzzle addresses, and 0.01 BTC three times.",
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
      fact(
        "Printed the key of puzzle #135 while explaining mini-puzzle #7, whose winner did not write the solution in the thread: It's not polite.",
        "https://bitcointalk.org/index.php?topic=5589799.msg66992048#msg66992048",
        { date: "2026-07-29" },
      ),
    ],
  });

  /** Every puzzle in this collection, oldest first. */
  static readonly puzzles = [mini1, mini2, mini3, mini4, mini5, mini6, mini7];

  /** Builds the canonical collection. */
  constructor() {
    super(MiniCollection.key, MiniCollection.author, MiniCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const mini = new MiniCollection();
