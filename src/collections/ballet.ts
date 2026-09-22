import { NamedCollection } from "../core/collection.ts";
import { fact, party, PartyKind, profile } from "../core/parts.ts";
import { balletPuzzleAA007448 } from "./ballet/aa007448.ts";
import { balletPuzzleAA009926 } from "./ballet/aa009926.ts";
import { balletPuzzleAA012381 } from "./ballet/aa012381.ts";

/** Bobby Lee's Ballet Crypto physical wallet puzzles. */
export class BalletCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "ballet";

  /** Who published the puzzles. */
  static readonly author = party("Bobby Lee", {
    key: "bobby-lee",
    kind: PartyKind.Person,
    about:
      "Founder and CEO of Ballet, the physical wallet company, and before that co-founder and CEO of BTCC, the first Bitcoin exchange in China.",
    addresses: ["bc1q8car4m7afzx46m2kuhe5xv2ztvc98mk3glyccx"],
    profiles: [
      profile("twitter", "https://x.com/bobbyclee"),
      profile("website", "https://www.ballet.com/about"),
    ],
    facts: [
      fact(
        "Founded Ballet in early 2019 to sell cold storage wallets that need no setup. The company is headquartered in Las Vegas.",
        "https://www.ballet.com/about",
      ),
      fact(
        "Co-founded BTCC, formerly BTCChina, and ran it as CEO until its acquisition in January 2018.",
        "https://www.ballet.com/about",
      ),
      fact(
        "Ran the BTCC Mint line of physical bitcoins from 2016 to 2018 and supervised the private keys of the more than 8,600 BTC loaded into them.",
        "https://www.ballet.com/about",
      ),
      fact(
        "Posted the three Ballet puzzles on X in July 2020, each a BIP38 key printed on a physical wallet.",
        "https://x.com/bobbyclee/status/1289004702122643456",
        { date: "2020-07-31" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [balletPuzzleAA007448, balletPuzzleAA009926, balletPuzzleAA012381];

  /** Builds the canonical collection. */
  constructor() {
    super(BalletCollection.key, BalletCollection.author, BalletCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const ballet = new BalletCollection();
