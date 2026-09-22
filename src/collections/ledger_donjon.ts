import { NamedCollection } from "../core/collection.ts";
import { fact, party, PartyKind, profile } from "../core/parts.ts";
import { ledgerDonjonPuzzleScissorsSecretSharing } from "./ledger_donjon/scissors-secret-sharing.ts";

/** Ledger Donjon's Capture the Fortress CTF challenges with published wallet targets. */
export class LedgerDonjonCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "ledger_donjon";

  /** Who published the challenges. */
  static readonly author = party("Ledger Donjon", {
    key: "ledger-donjon",
    kind: PartyKind.Organization,
    about: "Ledger's security research team, which ran the Capture the Fortress CTF in 2020.",
    profiles: [
      profile("website", "https://donjon.ledger.com/"),
      profile("website", "https://www.ledger.com/blog/Capture-the-Fortress"),
    ],
    facts: [
      fact(
        "Introduced on 2018-12-11 by Ledger's CSO Charles Guillemet as an internal security evaluation lab of eight experts covering software, side channel and fault attacks.",
        "https://www.ledger.com/blog/introducing-ledger-donjon",
        { date: "2018-12-11" },
      ),
      fact(
        "Says it open sources its attack tools and methodology and drives Ledger's bug bounty program.",
        "https://www.ledger.com/blog/introducing-ledger-donjon",
        { date: "2018-12-11" },
      ),
      fact(
        "Capture the Fortress ran from 2020-10-28 to 2020-11-18 as a jeopardy CTF with more than 15 challenges. First prize was 400 dollars and a Ledger Backup Pack.",
        "https://www.ledger.com/blog/Capture-the-Fortress",
        { date: "2020-10-21" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [ledgerDonjonPuzzleScissorsSecretSharing];

  /** Builds the canonical collection. */
  constructor() {
    super(
      LedgerDonjonCollection.key,
      LedgerDonjonCollection.author,
      LedgerDonjonCollection.puzzles,
    );
  }
}

/** Canonical collection instance. */
export const ledgerDonjon = new LedgerDonjonCollection();
