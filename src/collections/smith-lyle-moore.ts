import { NamedCollection } from "../core/collection.ts";
import { fact, party, PartyKind, profile } from "../core/parts.ts";
import { smithLyleMooreBornToBeWild } from "./smith-lyle-moore/born-to-be-wild.ts";
import { smithLyleMooreGlimmer } from "./smith-lyle-moore/glimmer.ts";

/** Smith, Lyle & Moore's treasure hunts, one per single. */
export class SmithLyleMooreCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "smith-lyle-moore";

  /** The band that funded both hunts. */
  static readonly author = party("Smith, Lyle & Moore", {
    key: "smith-lyle-moore",
    kind: PartyKind.Organization,
    about:
      "Indie band that spent its advertising budget on bitcoin and buried it behind riddles on its own website, one treasure hunt per single.",
    profiles: [
      profile("website", "https://www.smithlylemoore.com/"),
      profile("reddit", "https://www.reddit.com/r/smithlylemoore/"),
      profile("instagram", "https://instagram.com/smithlylemoore"),
    ],
    facts: [
      fact(
        "Diverted a large chunk of the band's advertising budget to a treasure hunt in the Born to Be Wild album cover and music video, leading to .025 Bitcoin, and showed the wallet as an xpub.",
        "https://web.archive.org/web/20210628003610/https://www.smithlylemoore.com/treasure-hunt",
      ),
      fact(
        "Congratulated the group that solved Born to Be Wild under its write-up, then explained the gold frames, the giant step and the clue that pointed the vault at Morse.",
        "https://www.reddit.com/r/smithlylemoore/comments/p6wzkk/bitcoin_treasure_hunt_solutionwriteup/",
        { date: "2021-08-18" },
      ),
      fact(
        "Wove a story into the single Glimmer that leads to .031777 Bitcoin, a second hunt that picks up where the first one left off.",
        "https://www.smithlylemoore.com/more-info",
      ),
    ],
  });

  /** Both hunts, in funding order. */
  static readonly puzzles = [smithLyleMooreBornToBeWild, smithLyleMooreGlimmer];

  /** Builds the canonical collection. */
  constructor() {
    super(
      SmithLyleMooreCollection.key,
      SmithLyleMooreCollection.author,
      SmithLyleMooreCollection.puzzles,
    );
  }
}

/** Canonical collection instance. */
export const smithLyleMoore = new SmithLyleMooreCollection();
