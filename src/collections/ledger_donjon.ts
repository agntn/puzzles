import { NamedCollection } from "../core/collection.ts";
import { party, profile } from "../core/parts.ts";
import { ledgerDonjonPuzzleScissorsSecretSharing } from "./ledger_donjon/scissors-secret-sharing.ts";

/** Ledger Donjon's Capture the Fortress CTF challenges with published wallet targets. */
export class LedgerDonjonCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "ledger_donjon";

  /** Who published the challenges. */
  static readonly author = party("Ledger Donjon", {
    profiles: [profile("website", "https://www.ledger.com/blog/capture-the-fortress")],
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
