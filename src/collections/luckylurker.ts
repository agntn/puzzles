import { NamedCollection } from "../core/collection.ts";
import { fact, party, PartyKind, profile } from "../core/parts.ts";
import { luckyLurkerVault1 } from "./luckylurker/vault-1.ts";
import { luckyLurkerVault2 } from "./luckylurker/vault-2.ts";

/** Bitcoin seed riddles published by LuckyLurker. */
export class LuckyLurkerCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "luckylurker";

  /** Paul Jones publishes the Vaults as Paul_LuckyLurker on BitcoinTalk. */
  static readonly author = party("Paul Jones", {
    key: "paul-jones",
    kind: PartyKind.Person,
    about:
      "Byline on luckylurker.com, a casino review site, where the Bitcoin Vaults run as promotions between the reviews.",
    profiles: [
      profile("website", "https://luckylurker.com/author/paul-jones/"),
      profile("bitcointalk", "https://bitcointalk.org/index.php?action=profile;u=3750819"),
    ],
    facts: [
      fact(
        "The author page says he started playing online slots in 2014 and has tested hundreds of casinos since, with no formal credentials.",
        "https://luckylurker.com/author/paul-jones/",
      ),
      fact(
        "The Vault posts sit next to casino reviews and bonus guides on the same site, and four of the twelve hints of the first Vault point at other articles there.",
        "https://luckylurker.com/bitcoin-vault/",
      ),
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
