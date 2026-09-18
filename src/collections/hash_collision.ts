import { NamedCollection } from "../core/collection.ts";
import { party, profile } from "../core/parts.ts";
import { hashCollisionPuzzleSha1 } from "./hash-collision/sha1.ts";
import { hashCollisionPuzzleSha256 } from "./hash-collision/sha256.ts";
import { hashCollisionPuzzleRipemd160 } from "./hash-collision/ripemd160.ts";
import { hashCollisionPuzzleHash160 } from "./hash-collision/hash160.ts";
import { hashCollisionPuzzleHash256 } from "./hash-collision/hash256.ts";
import { hashCollisionPuzzleOpAbs } from "./hash-collision/op-abs.ts";

/** Peter Todd's P2SH hash-collision bounties. */
export class HashCollisionCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "hash_collision";

  /** Who published the puzzles. */
  static readonly author = party("Peter Todd", {
    addresses: ["1FCYd7j4CThTMzts78rh6iQJLBRGPW9fWv", "3MeoP8VzBURphKjrpkyY2GoW52z32ZmfK7"],
    profiles: [profile("bitcointalk", "https://bitcointalk.org/index.php?topic=293382.0")],
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
