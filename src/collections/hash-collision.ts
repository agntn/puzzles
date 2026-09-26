import { NamedCollection } from "../core/collection.ts";
import { fact, party, PartyKind, profile } from "../core/parts.ts";
import { hashCollisionPuzzleSha1 } from "./hash-collision/sha1.ts";
import { hashCollisionPuzzleSha256 } from "./hash-collision/sha256.ts";
import { hashCollisionPuzzleRipemd160 } from "./hash-collision/ripemd160.ts";
import { hashCollisionPuzzleHash160 } from "./hash-collision/hash160.ts";
import { hashCollisionPuzzleHash256 } from "./hash-collision/hash256.ts";
import { hashCollisionPuzzleOpAbs } from "./hash-collision/op-abs.ts";

/** Peter Todd's P2SH hash-collision bounties. */
export class HashCollisionCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "hash-collision";

  /** Who published the puzzles. */
  static readonly author = party("Peter Todd", {
    key: "peter-todd",
    kind: PartyKind.Person,
    about:
      "Bitcoin Core contributor and applied cryptography consultant, creator of OpenTimestamps, who paid for hash collisions with Bitcoin script in 2013.",
    addresses: ["1FCYd7j4CThTMzts78rh6iQJLBRGPW9fWv", "3MeoP8VzBURphKjrpkyY2GoW52z32ZmfK7"],
    profiles: [
      profile("website", "https://petertodd.org/"),
      profile("github", "https://github.com/petertodd"),
      profile("twitter", "https://x.com/peterktodd"),
      profile("keybase", "https://keybase.io/petertodd"),
      profile("bitcointalk", "https://bitcointalk.org/index.php?topic=293382.0"),
    ],
    facts: [
      fact(
        "Posted the bounties on bitcointalk in September 2013: P2SH scripts that pay anyone who presents two different inputs with the same hash.",
        "https://bitcointalk.org/index.php?topic=293382.0",
        { date: "2013-09-13" },
      ),
      fact(
        "Created OpenTimestamps, a standard for timestamping data on Bitcoin with free calendar servers.",
        "https://opentimestamps.org/",
      ),
      fact(
        "Writes at petertodd.org since 2013: replace by fee, timestamping, consensus and code review of Segwit and V3 transactions.",
        "https://petertodd.org/",
      ),
      fact(
        "The Keybase account proves one key over petertodd.org, GitHub petertodd, Reddit petertodd and X peterktodd.",
        "https://keybase.io/petertodd",
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [
    hashCollisionPuzzleSha1,
    hashCollisionPuzzleSha256,
    hashCollisionPuzzleRipemd160,
    hashCollisionPuzzleHash160,
    hashCollisionPuzzleHash256,
    hashCollisionPuzzleOpAbs,
  ];

  /** Builds the canonical collection. */
  constructor() {
    super(
      HashCollisionCollection.key,
      HashCollisionCollection.author,
      HashCollisionCollection.puzzles,
    );
  }
}

/** Canonical collection instance. */
export const hashCollision = new HashCollisionCollection();
