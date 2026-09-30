import { SingletonCollection } from "../core/collection.ts";
import {
  artifact,
  confirmation,
  decrease,
  fact,
  funding,
  increase,
  official,
  party,
  PartyKind,
  profile,
  stage,
  standard,
  uncompressed,
} from "../core/parts.ts";
import { basePuzzle } from "../core/puzzle.ts";

/** The puzzle page: the album's description, the prize contract, the mint and the winner wallet. */
const PAGE = "https://logicbeach.xyz/powerfulmoss";

/**
 * The page as it stood after the launch, with the longer description the author later cut:
 * the steps of the puzzle and the note on lossless files.
 */
const LAUNCH_PAGE = confirmation(
  "https://web.archive.org/web/20250303003748/https://logicbeach.xyz/powerfulmoss",
  "Wayback capture of the puzzle page from March 2025",
);

/** The full album video on the author's YouTube channel, one of the links the launch cast gives. */
const ALBUM = "https://www.youtube.com/watch?v=li4e7wyHMv0";

/**
 * A cast by LogicBeach on Farcaster, by the short hash the Farcaster client links it with.
 *
 * @param {string} hash - The first eight hex digits of the cast hash, with `0x`.
 * @returns {string} The cast's permalink.
 */
function cast(hash: string): string {
  return `https://farcaster.xyz/logic-beach/${hash}`;
}

/** The album announced, with Donkey Kong Country 2 soundfonts and a crypto puzzle to come. */
const ANNOUNCEMENT = cast("0x79eeff14");

/** The launch: the album on the streaming services and the puzzle page. */
const LAUNCH = cast("0x57ab427d");

/** A week after the launch: the prize near 0.5 ETH and eight POAPs found. */
const FIRST_WEEK = cast("0x6179943b");

/**
 * Powerful Moss: a twelve-track album with a twelve-word seed hidden in it. The seed opens the
 * winner wallet, and only that wallet can take the prize out of the contract that holds it. The
 * contract went up on January 10, 2025, a week before the album. The two withdrawals that day
 * returned two test mints before the 0.25 ETH the page says the prize starts at.
 */
export const powerfulMossAlbum = basePuzzle({
  id: "powerful-moss",
  address: standard("0x635739254BDE27d28301f25aD57c3cAC3C3468f3"),
  escrow: standard("0x831102C7eb86f9EC8f79dF891bDeA187D54344Dd"),
  sourceUrl: PAGE,
  startedAt: "2025-01-17 12:55:27",
  preGenesis: true,
  pubkey: uncompressed(
    "04d8e5d392cb30d9f69334a0bffe3075dff2667cabe758fc53a24aba2c3ed58a6c64bb13365e7faea54a217ab5681c998c0bd1c771e5925858a6657422a8da6604",
  ),
  prize: 0.55941,
  stages: [
    stage(
      "seed",
      "Find the twelve words hidden in the album and put them in order. The phrase derives the winner wallet.",
      [artifact("full album video", ALBUM), artifact("puzzle page", PAGE)],
    ),
    stage(
      "withdraw",
      "Only the winner wallet may withdraw the prize from the contract. It starts at 0.25 ETH and grows to the whole contract balance over two months, and an early withdrawal forfeits the rest to the creator.",
      [artifact("puzzle page", PAGE)],
    ),
  ],
  hints: [
    official(
      "Using DonkeyKongCountry2 midi sound-fonts, iykyk ;] This will once again be released as a crypto puzzle with baffling concepts. I'm aiming to create a puzzle that requires uncommon knowledge, but won't take a genius, to solve.",
      ANNOUNCEMENT,
      undefined,
      { date: "2024-03-26" },
    ),
    official(
      "I'm working on the music still, but have a few of the 12 words already baked in ;)",
      cast("0x0a3431a4"),
      undefined,
      { date: "2024-04-14" },
    ),
    official(
      "It'll be similar to this one https://cointelegraph.com/news/treasure-hunters-race-to-claim-btc-prize-hidden-in-new-music-album Solution: https://elronvhubbard.medium.com/logic-beach-bifurcations-album-puzzle-write-up-1e1094d41038",
      cast("0x7e781ad1"),
      undefined,
      { date: "2024-04-14" },
    ),
    official(
      "Ya know, I've tried really hard in the past to make the puzzles technically difficult and it gets solved way too fast, so I am taking care to make this one more creative.",
      cast("0x6ac613af"),
      undefined,
      { date: "2024-09-02" },
    ),
    official(
      "Like a clock, year, or seed phrase, this album has 12 of 'em. 12 songs... and all that implies. There's more waiting for those who pay attention and fall through the surface cracks.",
      PAGE,
      LAUNCH_PAGE,
    ),
    official(
      "Hidden across the tracks are 12 secret seed words, essential components of a cryptocurrency wallet.",
      PAGE,
      LAUNCH_PAGE,
    ),
    official(
      "To solve the puzzle, you must: Find all twelve words hidden in the album. Determine the correct order of these words.",
      PAGE,
      LAUNCH_PAGE,
    ),
    official("The Puzzle will require the actual lossless .wav files so...", PAGE, LAUNCH_PAGE),
    official("8 people have discovered the /poap This is a good sign ;]", FIRST_WEEK, undefined, {
      date: "2025-01-24",
    }),
  ],
  transactions: [
    funding(
      "0x2b3699be2d3a43b3bf5b1035fcd3529e7ed5359c7e3abe00e31260f5f9e8ee19",
      "2025-01-10 16:46:47",
      0.01,
    ),
    increase(
      "0x7cf9f382f6fff6cbf25a018e17ac9b2af719e307672b1faa1c1d735118011d74",
      "2025-01-10 16:47:27",
      0.00641,
    ),
    decrease(
      "0x6ed9c642ee209cd5efa142089c5e2292fc94bbfe16790cdebe9a499d2e84dec2",
      "2025-01-10 18:59:37",
      0.01,
    ),
    increase(
      "0x2f6b90921e8013338f18d79aef0e5decc6491c6fb5bfa0896ce14007a84b3f50",
      "2025-01-10 19:01:41",
      0.01,
    ),
    decrease(
      "0xe50fb85b607fc388dcd6471ac1dc1bf9bdff6e995f5f6dae279dd989723c142d",
      "2025-01-10 19:02:01",
      0.01,
    ),
    increase(
      "0x333cb186fa39bf3ab44ebdc4a7e22c61cd6faea0da0dccb6eefb34938063e652",
      "2025-01-10 19:03:05",
      0.25,
    ),
    increase(
      "0x628c9bd30ba9fc08cb2813b7202d0834f204a6f07504d5eb032bd7f61a281ac2",
      "2025-01-10 20:15:07",
      0.03,
    ),
    increase(
      "0x11ab0268ad68a30ca0b27bca80c901177b859d749735c7284b98c7548e78befa",
      "2025-01-10 22:41:05",
      0.1,
    ),
    increase(
      "0x65c9c09dbcd76387f0f817aaebf877739b7410e183f5f736faa2f2e8d2de742e",
      "2025-01-13 17:21:21",
      0.05,
    ),
    increase(
      "0xf3ee06c246a144d78ceb4d35a5e04f25f714a1c542afba04ecc3ea5cb56503e0",
      "2025-01-13 19:28:05",
      0.01,
    ),
    increase(
      "0xa650bb8fa8b17dce5478c74fdb1974606c0dca61356bce6276470426db3d072c",
      "2025-01-18 11:40:53",
      0.01,
    ),
    increase(
      "0xb560806046f81fe0b16979da5947c2b3fc955c9f9ad9cf7056ea58e53c4791fc",
      "2025-01-18 14:51:27",
      0.01,
    ),
    increase(
      "0x900db6a641181bada1e43b9bf672c9dee46dbf23909c9eec1c018ec0323b6ae0",
      "2025-01-18 18:31:59",
      0.01,
    ),
    increase(
      "0xcf3ec171a5ed31e0c736c9500955d51542d626f3ec0c69df08405fc78da91978",
      "2025-01-20 21:21:07",
      0.01,
    ),
    increase(
      "0x680ba420b89c39c0573881a7157b70dcb8a48c3046b6db84c43c0b2c129bcd13",
      "2025-01-22 23:24:19",
      0.01,
    ),
    increase(
      "0x6e8119f9fd76c6f6fb70c60f30d0a72a0f2032b48a056091be35d9599b276679",
      "2025-01-27 21:38:01",
      0.01,
    ),
    increase(
      "0x34e85e454e4774e25e6dfcd157719494c2c5617915841149ca3d64d03db3a56a",
      "2025-02-04 03:18:49",
      0.01,
    ),
    increase(
      "0xfece76e8397955ea5669ba5fe20dc661d09a982f3f5149dae295067bdd19a7ba",
      "2025-02-16 09:43:31",
      0.01,
    ),
    increase(
      "0xda1214d7a4fe6c424987982d523754fce2107a99ebdc7cba5f370fff482d2147",
      "2025-09-26 12:01:27",
      0.01,
    ),
    increase(
      "0x57b5d2be994cec47689c808f53c06481d7417172907e6e8fe8cd264cde8ae627",
      "2025-10-13 23:38:47",
      0.01,
    ),
    increase(
      "0x7f8b08387f236fe4a72939076be97c3524cfd527fb7b1d714833ba50d6f5d210",
      "2026-07-10 03:46:37",
      0.01,
    ),
    increase(
      "0x528970953d53f1fd2575268145ec39b6fcd65f819b63aff7d24886ac59df6581",
      "2026-08-16 21:27:59",
      0.001,
    ),
    increase(
      "0xa4a6217a897790bfbb82cb320a5e19f97389e57685cbe8e1fa15e8e27f4304f0",
      "2026-09-04 08:52:45",
      0.001,
    ),
    increase(
      "0x3ec0e9e6bb6c62c248e3ab28656c318d749f101ff1966079ab4d48229680de61",
      "2026-09-17 01:31:37",
      0.001,
    ),
  ],
});

/** Powerful Moss by LogicBeach, a Base prize hidden in an album. */
export class PowerfulMossCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "powerful-moss";

  /** Who published the puzzle. */
  static readonly author = party("LogicBeach", {
    key: "logicbeach",
    kind: PartyKind.Person,
    aliases: ["Logic Beach", "logic-beach"],
    about:
      "Electronic musician who releases albums as crypto puzzles, with a wallet seed hidden in the music.",
    profiles: [
      profile("website", "https://logicbeach.xyz/"),
      profile("farcaster", "https://farcaster.xyz/logic-beach"),
      profile("youtube", "https://www.youtube.com/@LogicBeach"),
      profile("bandcamp", "https://logicbeach.bandcamp.com/"),
    ],
    facts: [
      fact(
        "Announced a new album made with Donkey Kong Country 2 MIDI soundfonts, to be released once again as a crypto puzzle.",
        ANNOUNCEMENT,
        { date: "2024-03-26" },
      ),
      fact(
        "Released Powerful Moss on the usual streaming services, with the puzzle on logicbeach.xyz.",
        LAUNCH,
        { date: "2025-01-17" },
      ),
      fact(
        "Said a week after the release that the prize was up to about 0.5 ETH and still growing.",
        FIRST_WEEK,
        { date: "2025-01-24" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [powerfulMossAlbum];

  /** Builds the canonical collection. */
  constructor() {
    super(
      PowerfulMossCollection.key,
      PowerfulMossCollection.author,
      PowerfulMossCollection.puzzles,
    );
  }
}

/** Canonical collection instance. */
export const powerfulMoss = new PowerfulMossCollection();
