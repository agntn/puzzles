import { NamedCollection } from "../core/collection.ts";
import { party, profile } from "../core/parts.ts";
import { luckyLurkerVault1 } from "./luckylurker/vault-1.ts";
import { luckyLurkerVault2 } from "./luckylurker/vault-2.ts";

/** Bitcoin seed riddles published by LuckyLurker. */
export class LuckyLurkerCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "luckylurker";

  /** Paul Jones publishes the Vaults as Paul_LuckyLurker on BitcoinTalk. */
  static readonly author = party("Paul Jones", {
    profiles: [
      profile("website", "https://luckylurker.com/author/paul-jones/"),
      profile("bitcointalk", "https://bitcointalk.org/index.php?action=profile;u=3750819"),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [luckyLurkerVault1, luckyLurkerVault2];

  /** Builds the canonical collection. */
  constructor() {
    super(LuckyLurkerCollection.key, LuckyLurkerCollection.author, LuckyLurkerCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const luckyLurker = new LuckyLurkerCollection();
