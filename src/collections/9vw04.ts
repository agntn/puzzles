import { SingletonCollection } from "../core/collection.ts";
import {
  assets,
  compressed,
  confirmation,
  decrease,
  digest,
  fact,
  funding,
  increase,
  official,
  party,
  PartyKind,
  profile,
} from "../core/parts.ts";
import { puzzle } from "../core/puzzle.ts";

/**
 * A post by the author on X, by its ID.
 *
 * @param {string} id - The status ID.
 * @returns {string} The post's URL.
 */
function post(id: string): string {
  return `https://x.com/GemfinderOfX/status/${id}`;
}

/** The puzzle: one paragraph, the token 9vw04, the address and a grid of coloured characters. */
const ANNOUNCEMENT = post("1870319691295764655");

/** The private key example: 9vw04 twice, everything else masked. */
const EXAMPLE = post("1874632897459871930");

/** The author's January 13 post with additional hints. */
const ADDITIONAL = post("1878634169410203733");

/** The picture, at the size X stores the upload. The file under `assets/` is these bytes. */
const PICTURE = "https://pbs.twimg.com/media/GfS12G-WUAE_Lt2.jpg?name=orig";

/** The Daniel Shanks meme from January 6, 2025. */
const SHANKS = "https://pbs.twimg.com/media/Ggn3IcdXIAgCAME.jpg";

/** The rainbow GIF the author confirmed as a new hint, November 16, 2026. */
const RAINBOW = "https://video.twimg.com/tweet_video/HXOA-CObYAADAp2.mp4";

/** The rainbow table with a hash on its plate, November 24, 2026. */
const TABLE = "https://pbs.twimg.com/media/HX3YslUaAAE5Viu.jpg?name=orig";

/** The November 21, 2026 reply about the zero Base58 doesn't have. */
const FACE_VALUE = post("2124012727668748461");

/** A WIF hidden in one post, which holds everything for the key, the author says, rainbows aside. */
export const gemfinderOfX9vw04 = puzzle({
  id: "9vw04",
  chain: "bitcoin",
  address: "bc1qr5mssp6snmduqp9enx4dzmcxvk7qw83lceyy2v",
  sourceUrl: ANNOUNCEMENT,
  startedAt: "2024-12-21 04:05:37",
  preGenesis: true,
  pubkey: compressed("039d7ce87733444acfde33960964344d8201d2d92ccdad0f5045e40fdcf963475b"),
  prize: 0.0202076,
  hints: [
    official(
      "Today I wanted to do something special. I’ve been in Bitcoin for many years now. And I’ve loved it. I want to have you all the chance to win 0.02 bitcoin ≈ $2,000.00 best of luck to you all. Everything for the private key can be found within this message.",
      ANNOUNCEMENT,
      undefined,
      { date: "2024-12-21" },
    ),
    official("Address⬇️ showing proof of funds. 9vw04", ANNOUNCEMENT, undefined, {
      date: "2024-12-21",
    }),
    official("I don’t really like rainbows.", post("1870866790752141328"), undefined, {
      date: "2024-12-22",
    }),
    official(
      "All the clues are in the post… you just aren’t looking hard enough.",
      post("1874575103230652759"),
      undefined,
      { date: "2025-01-01" },
    ),
    official(
      "All 5 of these numbers and letters appear 2 times in the private key example",
      EXAMPLE,
      undefined,
      { date: "2025-01-02" },
    ),
    official("******9vw04********************9vw04", EXAMPLE, undefined, { date: "2025-01-02" }),
    official(
      "Remember everything and I mean everything. Every word is a clue sometimes you just need to look in the mirror",
      post("1875410257754882121"),
      undefined,
      { date: "2025-01-04" },
    ),
    official(
      "I don’t like rainbows. Everything else is in the post",
      post("1875574373853360303"),
      undefined,
      {
        date: "2025-01-04",
      },
    ),
    official(
      "It’s there you just need to find the small thing everybody has overlooked so far",
      post("1875737695177339343"),
      undefined,
      { date: "2025-01-05" },
    ),
    official("WIF", post("1875982446598181044"), undefined, { date: "2025-01-05" }),
    official(
      "THE FACE YOU MAKE WHEN PPL OVERLOOK THE OBVIOUS",
      post("1876302447796486163"),
      undefined,
      {
        date: "2025-01-06",
      },
    ),
    official(
      "Nope just your Brian and everything in the post",
      post("1877378647050338548"),
      undefined,
      { date: "2025-01-09" },
    ),
    official(
      "Some additional hints for you guys. Yes it is a WIF and it may not seem possible but I can assure you that it is 100% possible.",
      ADDITIONAL,
      undefined,
      { date: "2025-01-13" },
    ),
    official("I don’t like rainbows is a hit", ADDITIONAL, undefined, { date: "2025-01-13" }),
    official(
      "And another hit was a imagine of Daniel shanks the creator of “baby step giant step” and trust me that’s very important here",
      ADDITIONAL,
      undefined,
      { date: "2025-01-13" },
    ),
    official(
      "Also the last hint.  the spelling is incorrect on purpose 😉",
      post("1878635172754788512"),
      undefined,
      { date: "2025-01-13" },
    ),
    official(
      "The Bitcoin is still there. All the clues are too. Grind",
      post("2022387091565613567"),
      undefined,
      {
        date: "2026-02-13",
      },
    ),
    official(
      "Every Nth character has something to say there could be a fixed interval skip cipher hidden in the sequence",
      post("2027938957112279215"),
      undefined,
      { date: "2026-03-01" },
    ),
    official(
      "Yes",
      post("2122360200921550936"),
      confirmation(
        post("2122181658984284485"),
        "The rainbow GIF this answers, asked if it was a new hint",
      ),
      { date: "2026-11-16" },
    ),
    official(
      "Yes it is a 0 ( zero ) not a “o” and yes it appears as is in the WIF",
      post("2122436606015713739"),
      undefined,
      { date: "2026-11-16" },
    ),
    official(
      "Yes you are correct, it’s meant to be a puzzle remember? I’ve given a lot of clues and 1 person was really close. Everything I’ve said and wrote has a reason even if technically not “correct”",
      FACE_VALUE,
      undefined,
      { date: "2026-11-21" },
    ),
    official("The main idea of this is not taking things at face value.", FACE_VALUE, undefined, {
      date: "2026-11-21",
    }),
    official(
      "Good luck to all of you still working on this. I’ve seen a handful of you guys making some leeway.",
      post("2125092863038124541"),
      undefined,
      { date: "2026-11-24" },
    ),
    official(
      "I’d say a little bit of understanding with math would be helpful (ai can do it if you couldn’t) but the main thing is utility of the repeated hints “🌈”",
      post("2125356189613781186"),
      undefined,
      { date: "2026-11-24" },
    ),
  ],
  transactions: [
    funding(
      "6f2b30df09dacd79249bd16e014141bc9747eff9d39094334181942f3294a76b",
      "2021-01-05 09:52:50",
      0.02547616,
    ),
    decrease(
      "82702e8a59babe3ad12ac5c7246f9ea98ad384860c9bbb119a6aeaf184146cb0",
      "2021-10-20 18:11:46",
      0.02032356,
    ),
    increase(
      "9ca459e7e9172f68a17b6e9bbd418ed2f50479168ad2a3241821a2a8ba74e527",
      "2021-11-03 13:51:15",
      0.01928356,
    ),
    decrease(
      "67dbb2436ed6d064b96b5854c31f74856e86152a11a4ea8224bbd3ba78984a21",
      "2024-11-28 10:54:45",
      0.0042,
    ),
  ],
  assets: assets({
    puzzle: "puzzle.jpg",
    hints: ["shanks.jpg", "rainbow.mp4", "table.jpg"],
    sourceUrl: PICTURE,
    digests: [
      digest(
        "puzzle.jpg",
        "bbcc87598a9a01227b0168ff59ee78544b0481d96805c518c84cc04098adadb4",
        337346,
        {
          url: PICTURE,
          archive:
            "https://web.archive.org/web/20250303015335id_/https://pbs.twimg.com/media/GfS12G-WUAE_Lt2?format=jpg&name=orig",
        },
      ),
      digest(
        "shanks.jpg",
        "11a3662a732c212bc12b9f96f77291ceda9628a9cf8c65eec9a2e08999bc3bdc",
        45880,
        { url: SHANKS },
      ),
      digest(
        "rainbow.mp4",
        "668c25d21aaf741f2658fed756a85a87494f99ddacb037405df42d4e2f52b67a",
        90838,
        { url: RAINBOW },
      ),
      digest(
        "table.jpg",
        "318cbca20201ec9385a4e5eb436e528db1fd81875a4bfd7484dececbfd9543e7",
        75172,
        { url: TABLE },
      ),
    ],
  }),
});

/** Gem Finder's 9vw04 puzzle, one post on X for 0.02 BTC. */
export class NineVw04Collection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "9vw04";

  /** Who posted the puzzle. */
  static readonly author = party("GemfinderOfX", {
    key: "gemfinderofx",
    kind: PartyKind.Person,
    aliases: ["Gem Finder", "IrrationalLibs"],
    about:
      "Published the 9vw04 Bitcoin puzzle on X in December 2024 and added hints through November 2026.",
    profiles: [profile("twitter", "https://x.com/GemfinderOfX")],
    facts: [
      fact(
        "Wrote of having been in Bitcoin for many years and offered 0.02 BTC to whoever finds the private key, all of it within the post.",
        ANNOUNCEMENT,
        { date: "2024-12-21" },
      ),
      fact(
        "Confirmed the key is a WIF and named Daniel Shanks, the creator of baby step giant step, as a very important hint.",
        ADDITIONAL,
        { date: "2025-01-13" },
      ),
      fact(
        "Posted a clue about every Nth character and a possible fixed interval skip cipher.",
        post("2027938957112279215"),
        { date: "2026-03-01" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [gemfinderOfX9vw04];

  /** Builds the canonical collection. */
  constructor() {
    super(NineVw04Collection.key, NineVw04Collection.author, NineVw04Collection.puzzles);
  }
}

/** Canonical collection instance. */
export const nineVw04 = new NineVw04Collection();
