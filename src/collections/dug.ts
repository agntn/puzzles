import { NamedCollection } from "../core/collection.ts";
import { confirmation, official, party, profile } from "../core/parts.ts";
import { dug2025Index0 } from "./dug/2025-0.ts";
import { dug2025Index1 } from "./dug/2025-1.ts";
import { dug2025Index2 } from "./dug/2025-2.ts";

/** The three funded targets in Dug's 2025 student treasure hunt. */
export class DugCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "dug";

  /** Dug publishes the lecture clues on Nostr. */
  static readonly author = party("Dug", {
    profiles: [
      profile(
        "nostr",
        "https://njump.me/npub1zrmu0amjmkynxlxgmdsyrjmp8vhxdz8ch5vja9vh9ym4natg8k5s8ge9wx",
      ),
    ],
  });

  /** One record per funded BIP84 address. */
  static readonly puzzles = [dug2025Index0, dug2025Index1, dug2025Index2];

  /** All three targets use the same seed phrase. */
  static readonly hints = [
    official(
      "Twelfth and Final Treasure Hunt Word: 12. Kingdom",
      "https://njump.me/note157473tjlhl8046c4uhxk6889nwgflwsjtlpwgzfuqp0lmq8vvzas0km4hc",
      confirmation(
        "https://blossom.primal.net/394004c70b8907504a2424865e866b10fe5746c89122899a968f3dbcd18ad6b3.jpg",
        "The lecture slide attached to Dug's signed Nostr event.",
      ),
      { date: "2025-10-07" },
    ),
  ];

  /** Builds the canonical collection. */
  constructor() {
    super(DugCollection.key, DugCollection.author, DugCollection.puzzles, DugCollection.hints);
  }
}

/** Canonical collection instance. */
export const dug = new DugCollection();
