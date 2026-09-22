import { NamedCollection } from "../core/collection.ts";
import { fact, party, PartyKind, profile } from "../core/parts.ts";
import { warpPuzzleChallenge1 } from "./warp/challenge-1.ts";
import { warpPuzzleChallenge2 } from "./warp/challenge-2.ts";
import { warpPuzzleChallenge3 } from "./warp/challenge-3.ts";
import { warpPuzzleChallenge4 } from "./warp/challenge-4.ts";
import { warpPuzzleWarpChallenge1 } from "./warp/warp-challenge-1.ts";
import { warpPuzzleWarpChallenge2 } from "./warp/warp-challenge-2.ts";

/** Keybase WarpWallet challenges. */
export class WarpCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "warp";

  /** Who published the puzzles. */
  static readonly author = party("Keybase", {
    key: "keybase",
    kind: PartyKind.Organization,
    about:
      "The identity and encryption company that published WarpWallet in 2013 and paid to have its own brainwallets cracked. Part of Zoom since 2020.",
    profiles: [
      profile("website", "https://keybase.io/warp"),
      profile("github", "https://github.com/keybase/warpwallet"),
      profile("twitter", "https://twitter.com/maxtaco"),
      profile("twitter", "https://twitter.com/malgorithms"),
    ],
    facts: [
      fact(
        "WarpWallet derives a key from scrypt and PBKDF2 over a passphrase and a salt, and the page lists the challenge wallets with their hints.",
        "https://keybase.io/warp",
        { date: "2013-11-19" },
      ),
      fact(
        "The code, the signed releases and the challenge history live in the keybase/warpwallet repository.",
        "https://github.com/keybase/warpwallet",
      ),
      fact(
        "Zoom acquired Keybase. The team said its first job was Zoom's security and that Keybase's future was in Zoom's hands.",
        "https://keybase.io/blog/keybase-joins-zoom",
        { date: "2020-05-07" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [
    warpPuzzleChallenge1,
    warpPuzzleChallenge2,
    warpPuzzleChallenge3,
    warpPuzzleChallenge4,
    warpPuzzleWarpChallenge1,
    warpPuzzleWarpChallenge2,
  ];

  /** Builds the canonical collection. */
  constructor() {
    super(WarpCollection.key, WarpCollection.author, WarpCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const warp = new WarpCollection();
