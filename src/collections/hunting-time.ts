import { SingletonCollection } from "../core/collection.ts";
import {
  answer,
  type Answer,
  assets,
  claim,
  compressed,
  digest,
  fact,
  funding,
  hex,
  increase,
  official,
  party,
  PartyKind,
  profile,
  technique,
} from "../core/parts.ts";
import { puzzle, Status } from "../core/puzzle.ts";

/**
 * A post by the author on X, by its ID.
 *
 * @param {string} id - The status ID.
 * @returns {string} The post's URL.
 */
function post(id: string): string {
  return `https://x.com/VeteranHODL/status/${id}`;
}

/**
 * A photo the author attached to a post, at the size X stores the upload.
 *
 * @param {string} id - The media ID in the image URL.
 * @returns {string} The image URL.
 */
function photo(id: string): string {
  return `https://pbs.twimg.com/media/${id}.jpg?name=orig`;
}

/** The announcement: a seed phrase hidden in the novel, with the first clue photo. */
const ANNOUNCEMENT = post("2071632285951226106");

/** The post that printed the address, called it an Electrum wallet and carried clue seven. */
const ADDRESS = post("2083486983142142452");

/** The day of the claim: congratulations, a bonus prize and one last hint. */
const CLAIMED = post("2089798740978577809");

/** The author's full solution, clue by clue, with the winner's handle. */
const SOLUTION = post("2090400955707830480");

/**
 * One line of the author's solution, as the answer to the clue it explains.
 *
 * @param {string} text - The line as the solution prints it.
 * @returns {Answer} The answer, dated the day the solution went up.
 */
function solved(text: string): Answer {
  return answer(text, SOLUTION, { date: "2026-08-20" });
}

/** A seed phrase hidden in a thriller, twelve photo clues on X, one Electrum wallet. */
export const huntingTime = puzzle({
  id: "hunting-time",
  chain: "bitcoin",
  address: "bc1qhzy6j4amw26z7e694mgfr7kvzl7xteu54f0a85",
  sourceUrl: ANNOUNCEMENT,
  startedAt: "2026-06-29 16:30:00",
  preGenesis: true,
  status: Status.Solved,
  pubkey: compressed("0370f4ef335df0da109a49fdd2627f5fb27c87545e991134ce0cf77291a6d48da4"),
  key: hex("f760c5b962545d5a44ddf77c8244dc62bd406ea7c890f84a63c555a8debd9686").derived(),
  techniques: [technique("hidden-seed-words", SOLUTION)],
  prize: 0.0042,
  solvedAt: "2026-08-18 02:07:20",
  solveTime: 4268240,
  solver: party("_radosinsky", {
    key: "radosinsky",
    about: "X user the author named as the winner of the Hunting Time seed phrase hunt.",
    facts: [
      fact("Named by the author as the winner, in the post with the full solution.", SOLUTION, {
        date: "2026-08-20",
      }),
    ],
  }),
  hints: [
    official(
      "I wonder if anyone has found the other hidden code yet...",
      post("2066614083105738752"),
      undefined,
      { date: "2026-06-15" },
    ),
    official(
      "Hidden within the pages of Hunting Time is a genuine Bitcoin seed phrase.",
      ANNOUNCEMENT,
      undefined,
      { date: "2026-06-29", answer: solved("1 - Page 24 → 12:24 → BIP39 #1224 → ocean") },
    ),
    official("Time for another clue.", post("2074168998938210563"), undefined, {
      date: "2026-07-06",
      answer: solved("2 - Electrical panel → electric"),
    }),
    official("Clue number three.", post("2076705716501610744"), undefined, {
      date: "2026-07-13",
      answer: solved("3 - Page 19 → 378 meters/connection → connect"),
    }),
    official("It's time for four.", post("2079242430499487893"), undefined, {
      date: "2026-07-20",
      answer: solved("4 - Page 210 → 07:20 → #720 → fly"),
    }),
    official("Clue Five.", post("2081779146196439527"), undefined, {
      date: "2026-07-27",
      answer: solved("5 - Sign → apology"),
    }),
    official("Six.", post("2082504700125966650"), undefined, {
      date: "2026-07-29",
      answer: solved("6 - Page 241 → 16:27 → #1627 → slender"),
    }),
    official(
      "Three years ago, when I started writing Hunting Time, I sent 210,000 sats to a fresh electrum wallet.",
      ADDRESS,
      undefined,
      { date: "2026-08-01" },
    ),
    official("Here is clue number seven.", ADDRESS, undefined, {
      date: "2026-08-01",
      answer: solved("7 - 14 + 60 → #1460 → reopen"),
    }),
    official(
      "After revealing seven seed phrase words, the entropy of the target wallet is 51 bits.",
      post("2083592109647401333"),
      undefined,
      { date: "2026-08-01" },
    ),
    official("Time for clue eight.", post("2084315859770872026"), undefined, {
      date: "2026-08-03",
      answer: solved("8 - Page 103 → 13:04 → #1304 → pepper"),
    }),
    official(
      "Clue number nine. Only three clues remaining.",
      post("2085434753092653555"),
      undefined,
      { date: "2026-08-06", answer: solved("9 - Page 32 → 06:16 → #616 → erupt") },
    ),
    official("Clue TEN.", post("2086490186888986672"), undefined, {
      date: "2026-08-09",
      answer: solved("10 - Hotel-room image → curtain"),
    }),
    official("Clue ELEVEN.", post("2087297821921640942"), undefined, {
      date: "2026-08-11",
      answer: solved("11 - Page 103 → 001704 → #1704 → stay"),
    }),
    official("FINAL CLUE.", post("2087893684633141356"), undefined, {
      date: "2026-08-13",
      answer: solved("12 - Page 110 → 1992 → #1992 → wedding"),
    }),
    official(
      "The Sats are still out there ready to be claimed, but you will need the paperback to solve the puzzle",
      post("2088547059452235917"),
      undefined,
      { date: "2026-08-15" },
    ),
    official("A major clue is in the title of the book...", CLAIMED, undefined, {
      date: "2026-08-18",
      answer: solved("'Hunting Time' was actually the biggest clue."),
    }),
  ],
  transactions: [
    funding(
      "00a72c1b2bd08db06d4ea7027d4352a3644a9b3a3c81cdacf82379cbff95b33a",
      "2023-07-22 09:43:25",
      0.0021,
    ),
    increase(
      "45ea9718a05f453cf44ccbce9771464f29136bcfc54f62627eca2519f6985a10",
      "2026-07-31 23:23:00",
      0.0021,
    ),
    claim(
      "d3783a1cde2c491a6edfbead81aeebda90257c8c25b4b0c9b2bac89bc5cd607a",
      "2026-08-18 02:07:20",
      0.00419642,
    ),
  ],
  assets: assets({
    hints: [
      "cover.jpg",
      "clue-01.jpg",
      "clue-02.jpg",
      "clue-03.jpg",
      "clue-04.jpg",
      "clue-05.jpg",
      "clue-06.jpg",
      "clue-07.jpg",
      "clue-08.jpg",
      "clue-09.jpg",
      "clue-10.jpg",
      "clue-11.jpg",
      "clue-12.jpg",
    ],
    digests: [
      digest(
        "cover.jpg",
        "031284f1a95986ce0548dd04f4a4380db93d1add5e21fe40ede0e2b814d70607",
        525768,
        { url: photo("HK4WjnGXAAAaTYG") },
      ),
      digest(
        "clue-01.jpg",
        "caed7df9e161f6f02c68fbe168705dd8db7987ffef9710ed3336262fdc32bf6c",
        271473,
        { url: photo("HL_pzFfWIAAZ-sl") },
      ),
      digest(
        "clue-02.jpg",
        "8731aa4b6cd1e4894d595e98849fdb577c9d2f2353b43689ed841ed5dcab5d2c",
        246768,
        { url: photo("HMjsVnIXIAErtZa") },
      ),
      digest(
        "clue-03.jpg",
        "3d7a386cce2b129ffa48632149c93b5013c3a023f7f21cb92a9a3e3be77ed869",
        177775,
        { url: photo("HNB1zr_XYAAFE5N") },
      ),
      digest(
        "clue-04.jpg",
        "01e91542cd6b0fe25cd5223d37ad4976eb0061c294f986fa849ca7eae4e935ef",
        241617,
        { url: photo("HNry7JoWMAAWa7k") },
      ),
      digest(
        "clue-05.jpg",
        "b1ec6f1a17d5619ed5134d38bff2a99895554543d3d1131368e0c57165f8f365",
        209444,
        { url: photo("HOPt1B2WkAAPFca") },
      ),
      digest(
        "clue-06.jpg",
        "0374dc9db48e2a0b076d49a984a50569e6872d6f3679098e9bf33dcce2e86d63",
        200178,
        { url: photo("HOaK9QsWUAACSoS") },
      ),
      digest(
        "clue-07.jpg",
        "2b0aa885fee2709dc14b6dfa56609096c79ccced0fe050c6b0676a24185b69ff",
        192035,
        { url: photo("HOoHoo5WwAEwo7W") },
      ),
      digest(
        "clue-08.jpg",
        "78263fc2ef228d9eb58ecccc325079f020ed8ee696e8879495203acbbcda7bdb",
        211866,
        { url: photo("HOz3TvBWQAAL-X-") },
      ),
      digest(
        "clue-09.jpg",
        "67d5e49c53b818bf36a97087348fb444fa59aa56fd1b24002ac93033c336e7c1",
        300071,
        { url: photo("HPDzzLjWQAAf5cZ") },
      ),
      digest(
        "clue-10.jpg",
        "023093f6540c6c6ca0769c71defb05f370d257e7965f778e9c7ce835f851067c",
        253446,
        { url: photo("HPSsyANXMAA553S") },
      ),
      digest(
        "clue-11.jpg",
        "393bdf01333569d6983a663eae7a1e3ec792929415302046e9601171a576faab",
        222988,
        { url: photo("HPeSOYwXwAAk2Wk") },
      ),
      digest(
        "clue-12.jpg",
        "0474568116e553cab3bd4e5347156623c98ecc1a6bf818bbcd699dd10de26f09",
        293320,
        { url: photo("HPlSoVUWgAAr50E") },
      ),
    ],
  }),
});

/** VeteranHODL's novel Hunting Time, one puzzle for 420,000 sats. */
export class HuntingTimeCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "hunting-time";

  /** Who wrote the novel and hid the phrase. */
  static readonly author = party("VeteranHODL", {
    key: "veteranhodl",
    kind: PartyKind.Person,
    aliases: ["V HODL"],
    about:
      "Former British Army soldier who writes techno-thrillers about Bitcoin and hid a working seed phrase in the first one.",
    profiles: [profile("twitter", "https://x.com/VeteranHODL")],
    facts: [
      fact(
        "Announced that a genuine Bitcoin seed phrase is hidden within the pages of his novel Hunting Time, with clues to follow over the coming weeks.",
        ANNOUNCEMENT,
        { date: "2026-06-29" },
      ),
      fact(
        "Said he sent 210,000 sats to a fresh Electrum wallet three years earlier, when he started writing Hunting Time, and that a stranger had just topped it up with another 210,000.",
        ADDRESS,
        { date: "2026-08-01" },
      ),
      fact(
        "Congratulated the winner the day the 420,000 sats were claimed and offered a bonus prize to whoever claimed them.",
        CLAIMED,
        { date: "2026-08-18" },
      ),
      fact(
        "Published the full solution: most of the twelve words hide as times in the plot, and the clues point to page numbers or words.",
        SOLUTION,
        { date: "2026-08-20" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [huntingTime];

  /** Builds the canonical collection. */
  constructor() {
    super(HuntingTimeCollection.key, HuntingTimeCollection.author, HuntingTimeCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const huntingTimeCollection = new HuntingTimeCollection();
