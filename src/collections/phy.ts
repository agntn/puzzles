import { SingletonCollection } from "../core/collection.ts";
import {
  answer,
  assets,
  community,
  compressed,
  confirmation,
  digest,
  funding,
  official,
} from "../core/parts.ts";
import { puzzle } from "../core/puzzle.ts";
import { EightyBitCollection } from "./80-bit.ts";

/**
 * A post in the Phy Challenge thread, by its message id.
 *
 * @param {string} id - The number Bitcointalk prints after `msg`.
 * @returns {string} The post's permalink.
 */
function post(id: string): string {
  return `https://bitcointalk.org/index.php?topic=5584952.msg${id}#msg${id}`;
}

/** The first post: the signed text, its Base64 signature and the picture. */
const OP = post("66802369");

/** The post that announced the prize, the missing character and the PGP message. */
const PRIZE = post("66860784");

/** The thread on June 29, before the author struck through the missing character. */
const FIRST_PAGE = confirmation(
  "https://web.archive.org/web/20260629174249/https://bitcointalk.org/index.php?topic=5584952.0",
  "Wayback capture of the first page from June 2026, signature still one character short",
);

/** NotATether's post: the missing J and the address the signature recovers. */
const NOTATETHER = post("66990855");

/** Where the picture was posted. The file under `assets/` is what this URL still serves. */
const PICTURE = "https://www.talkimg.com/images/2026/06/05/UrS0Mq.png";

/**
 * A signed post, its signature one character short and a spiral of grey emojis. The signature
 * gives up the address and its public key. The key behind them is the puzzle.
 */
export const phyChallenge = puzzle({
  id: "phy",
  chain: "bitcoin",
  address: "bc1qrpn28qa82uyjg37dvsz3w7wpm3kpdea957nm9p",
  sourceUrl: OP,
  startedAt: "2026-06-05 19:15:46",
  pubkey: compressed("02425afdd1716149faf414b6fdb96d5e7afc8ce42496042f4df559c80a7c6650eb"),
  prize: 0.008,
  hints: [
    official(
      "looks bad this bearish cycle around and no end is in sight, so here's a puzzle for everyone, no loose ends, no hashing.",
      OP,
      FIRST_PAGE,
      { date: "2026-06-05" },
    ),
    official(
      "There is currently a missing char in the second code of the first post. I will fix it after/if someone figures it out.",
      PRIZE,
      FIRST_PAGE,
      { date: "2026-06-21", answer: answer("J", NOTATETHER, { date: "2026-07-29" }) },
    ),
    official(
      'The rest of the provided parts are all correct and complete, and there is a prize (as of today). If you reach a state where you believe "this cannot be solved", it means you are missing the direct and indirect clues along the way.',
      PRIZE,
      FIRST_PAGE,
      { date: "2026-06-21" },
    ),
    official(
      "A final useful sign (the password's already mentioned). -----BEGIN PGP MESSAGE----- jA0ECQMKVwglgSLxlRn/0jcBn0f9h3kbilK/NDDWZCkuONpev7JZbbw+l6uVZC0N aJFXTLG6sbLXr6t0z3scptSM3vWBCmOU =D+ub -----END PGP MESSAGE-----",
      PRIZE,
      FIRST_PAGE,
      { date: "2026-06-21" },
    ),
    official(
      "Congrats on decoding the puzzle hint. But it's not the missing char.",
      post("66888088"),
      undefined,
      {
        date: "2026-06-29",
      },
    ),
    official(
      "I don't know what to hint at, when the hints are already inside-out, and everyone seems to be stuck at the ASCII 8 cat incident, or don't want to share what they found.",
      post("66971742"),
      undefined,
      { date: "2026-07-23" },
    ),
    official(
      "To progress before wasting any compute power, the data speaks for itself, which creates some immediate conclusions, so no idea where it was ever hinted anything about using Kangaroo.",
      post("66991304"),
      undefined,
      { date: "2026-07-29" },
    ),
    official(
      "Why would you think the address is wrong, since the signature verifies?",
      post("67040416"),
      undefined,
      { date: "2026-08-13" },
    ),
    official(
      "You got pretty close with 97% of the recoloring, nice, though a much easier and precise normalization than grayscale-to-tone exists, if some overall observations are made.",
      post("67070333"),
      undefined,
      { date: "2026-08-22" },
    ),
    official(
      "If you're referring to the extra LF, no, but I can't fix that for obvious reasons.",
      post("67090189"),
      undefined,
      { date: "2026-08-28" },
    ),
    official(
      "Guys, stop sending DMs and LLM essays about the puzzle, everything required to solve is in the first post, and it's actually much easier to solve then I anticipated. I already gave too many hints as it is.",
      post("67090189"),
      undefined,
      { date: "2026-08-28" },
    ),
    official(
      "meta-clue to either wake up or confuse even more your LLMs, as they seem to have crossed off-road... gvonys fhelucrM kbZ",
      post("67116131"),
      undefined,
      { date: "2026-09-05" },
    ),
    official(
      "There's no \"useless\" information added into the puzzle. If all of you are thinking some LLM will magically deduct information that's visible in plain sight by anyone, you should understand that LLMs can only understand data they were trained about, and this puzzle is not one of those things.",
      post("67117836"),
      undefined,
      { date: "2026-09-06" },
    ),
    official(
      "Only if you already know that the image was redrawn and requires to test the skin-tone to fix the image.",
      post("67122008"),
      undefined,
      { date: "2026-09-07" },
    ),
    official(
      "The third one helps as well. But anyway, all the clues I've given were already in the puzzle, since the puzzle is already self-explaining itself. The smart approach can find the correct solution in 4 milliseconds.",
      post("67146555"),
      undefined,
      { date: "2026-09-15" },
    ),
    official("This is a hint.", post("67170689"), undefined, { date: "2026-09-23" }),
    community("Phyllotaxis ?", post("66855641"), undefined, { date: "2026-06-20" }),
    community(
      "The signature signs the complete OP text with no trailing newline. It recovers the funded SegWit address bc1qrpn28qa82uyjg37dvsz3w7wpm3kpdea957nm9p, currently holding 800,000 sats.",
      NOTATETHER,
      undefined,
      { date: "2026-07-29" },
    ),
  ],
  transactions: [
    funding(
      "2ba79d0b377ab2c41f3508e91e84d0b2aff771fd81b97b8e85c24788795964d3",
      "2026-06-21 18:08:38",
      0.008,
    ),
  ],
  assets: assets({
    puzzle: "puzzle.png",
    sourceUrl: PICTURE,
    digests: [
      digest(
        "puzzle.png",
        "baf3ed80ffd8d2a1c17cdc8e212910abffdda4ede0b5900d542f587ef346cdc9",
        1687922,
        {
          url: PICTURE,
          archive:
            "https://web.archive.org/web/20260925213920id_/https://www.talkimg.com/images/2026/06/05/UrS0Mq.png",
        },
      ),
    ],
  }),
});

/** kTimesG's Phy Challenge from Bitcointalk. */
export class PhyCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "phy";

  /** Who published the puzzle, the same kTimesG as the 80-bit challenge. */
  static readonly author = EightyBitCollection.author;

  /** Every puzzle in this collection. */
  static readonly puzzles = [phyChallenge];

  /** Builds the canonical collection. */
  constructor() {
    super(PhyCollection.key, PhyCollection.author, PhyCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const phy = new PhyCollection();
