import { NamedCollection } from "../core/collection.ts";
import { party, profile } from "../core/parts.ts";
import { zdenPuzzleLevel1 } from "./zden/level-1.ts";
import { zdenPuzzleLevel2 } from "./zden/level-2.ts";
import { zdenPuzzleLevel3 } from "./zden/level-3.ts";
import { zdenPuzzleLevel4 } from "./zden/level-4.ts";
import { zdenPuzzleLevel5 } from "./zden/level-5.ts";
import { zdenPuzzleLevelHalv } from "./zden/level-halv.ts";
import { zdenPuzzleLevelSfx } from "./zden/level-sfx.ts";
import { zdenPuzzleLevelXm17 } from "./zden/level-xm17.ts";
import { zdenPuzzle1bitcoinWhitePaper } from "./zden/1bitcoin-white-paper.ts";
import { zdenPuzzleDemobit2018 } from "./zden/demobit-2018.ts";
import { zdenPuzzleNethemba } from "./zden/nethemba.ts";
import { zdenPuzzleXixoio } from "./zden/xixoio.ts";
import { zdenPuzzleCodexProtocol } from "./zden/codex-protocol.ts";
import { zdenPuzzleLitecoinSegwit } from "./zden/litecoin-segwit.ts";
import { zdenPuzzleDecredJanus } from "./zden/decred-janus.ts";
import { zdenPuzzleDecredAutonomy } from "./zden/decred-autonomy.ts";

/** Visual crypto puzzles by Zden. */
export class ZdenCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "zden";

  /** Who published the puzzles. */
  static readonly author = party("Zden", {
    addresses: ["1ZDEN78bAWtHqeRBJX7CT4QFEBA37r2N7", "1BTC4ARTieV3qDbxZK51it8KJ5mGQBYpXD"],
    profiles: [profile("twitter", "https://twitter.com/zd3n")],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [
    zdenPuzzleLevel1,
    zdenPuzzleLevel2,
    zdenPuzzleLevel3,
    zdenPuzzleLevel4,
    zdenPuzzleLevel5,
    zdenPuzzleLevelHalv,
    zdenPuzzleLevelSfx,
    zdenPuzzleLevelXm17,
    zdenPuzzle1bitcoinWhitePaper,
    zdenPuzzleDemobit2018,
    zdenPuzzleNethemba,
    zdenPuzzleXixoio,
    zdenPuzzleCodexProtocol,
    zdenPuzzleLitecoinSegwit,
    zdenPuzzleDecredJanus,
    zdenPuzzleDecredAutonomy,
  ];

  /** Builds the canonical collection. */
  constructor() {
    super(ZdenCollection.key, ZdenCollection.author, ZdenCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const zden = new ZdenCollection();
