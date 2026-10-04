import { NamedCollection } from "../core/collection.ts";
import {
  confirmation,
  fact,
  official,
  party,
  PartyKind,
  profile,
  technique,
} from "../core/parts.ts";
import { walkingBanks0 } from "./walking-banks/0.ts";
import { walkingBanks1 } from "./walking-banks/1.ts";

const SITE = "https://www.walkingbanks.com/";
const SITE_CAPTURE = "https://web.archive.org/web/20250716082759/https://www.walkingbanks.com/";
const BOOK = "https://d.nostr.build/UlE0X93faO1XxD9l.pdf";
const BOOK_POST =
  "https://njump.me/note1jvpc4m95fdr5hxqkhpyj5alcaeqj7hwtr6hdp4zk5n9uvewpzkyq2ldrlv";
const RIGHT_ORDER =
  "https://njump.me/note15ys0tl7dyjy3lgah9n4n8360lamefqe40w2d7d9asdgmk3km5ngsxpzqrp";

/** AH White's Walking Banks: a 24-word seed hidden in a thriller, two funded addresses. */
export class WalkingBanksCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "walking-banks";

  /** Who wrote the book and funded the wallet. */
  static readonly author = party("AH White", {
    key: "ah-white",
    kind: PartyKind.Person,
    aliases: ["AHWhite"],
    about:
      "Neurobiologist and bitcoiner who wrote a Bitcoin murder mystery, gave the PDF away on Nostr and hid a real seed phrase in the story.",
    profiles: [
      profile(
        "nostr",
        "https://njump.me/npub1c2rvx6ue9uewl452kczcfxz9w242sfzn64ul8dv2afd3t5dpktzs0kmmvf",
      ),
      profile("twitter", "https://twitter.com/_AHWhite"),
    ],
    facts: [
      fact(
        "Posted the free PDF of Walking Banks on Nostr, hosted on nostr.build, for anyone to download and share.",
        BOOK_POST,
        { date: "2024-09-06" },
      ),
      fact(
        "Announced with the audiobook that the story holds the information for a real Bitcoin seed phrase to a wallet with 0.008 BTC, first finder takes it.",
        "https://njump.me/note13jytkuegqd8tdlk0ewl9vyg4aeh6yxgcqe0zuatd379d8asnqd2sth0f3k",
        { date: "2025-05-15" },
      ),
      fact(
        "The Find the Treasure section of walkingbanks.com links the treasure wallet's xpub on blockchain.com rather than an address.",
        "https://web.archive.org/web/20250402113442/https://www.walkingbanks.com/",
      ),
      fact(
        "Answered a reader that no transaction showed up for the address, not even the deposits that loaded the wallet.",
        "https://njump.me/note1l9kql0d2urf8n26zgls65mssq4r5wmp27w77uzeu33jn5j3z0pvsuafh3a",
        { date: "2025-08-06" },
      ),
    ],
  });

  /** One record per funded address of the seed, in derivation order. */
  static readonly puzzles = [walkingBanks0, walkingBanks1];

  /** Both addresses open with the same 24 words, so every hint is shared. */
  static readonly hints = [
    official(
      'Nestled within the chapters of "Walking Banks" lie hints to a genuine bitcoin treasure, just waiting for a reader to uncover it.',
      SITE,
      confirmation(SITE_CAPTURE),
    ),
    official(
      "The book holds information that, when pieced together, unveil a seed phrase to a wallet containing real bitcoin; 0.008 BTC, or 800,000 Satoshis to be precise.",
      SITE,
      confirmation(SITE_CAPTURE),
    ),
    official(
      "xiiithirdiiicrystaliiismalliiiadviceiiireflectxxxxxxcrystaliiismalliiiadviceiiireflectxxxxxxcrystaliiismalliiiadviceiiireflectiiithirdiiix",
      BOOK,
      undefined,
      { date: "2024-09-06" },
    ),
    official(
      "“‘Crystal, small, advice, and reflect’ are words belonging to a list that is used to make up a bitcoin seed phrase which normally consists of twenty four words,” she said, pointing to the words on the screen. “And considering the context, I’d say they are to be entered as the third list of words in a longer seed phrase that will give you access to Liang Wei’s fortune stored on a wallet on the bitcoin blockchain.”",
      BOOK,
      undefined,
      { date: "2024-09-06" },
    ),
    official(
      "If your up for a treasure hunt, the book contains a real Bitcoin seed phrase hidden within the story. So if you can piece the right string of words together, it leads to a wallet with 800000 sats in it.",
      "https://njump.me/note1vm2c020vsrkvg077m3tptta2n44j2qez20zk65j6eeh3ta652jysd69g2q",
      undefined,
      { date: "2025-05-19" },
    ),
    official(
      "It's 24 words...if the wallet is not emptied after some time, I'll start dropping some hints from time to time",
      "https://njump.me/note1rmyu92ufwfl2nukzn2njlfynegu6jqyxhejc3207lztm5v3pugrsty535z",
      undefined,
      { date: "2025-05-19" },
    ),
    official(
      "Did you know that word repetitions are actually allowed in a seed phrase?",
      "https://njump.me/note1s29pn8p95u334wqspvyj2lm8naelfcel02zqxqk9h5t9kxmsq43q39zh0k",
      undefined,
      { date: "2025-11-21" },
    ),
    official(
      "So here some straightforward clues: the book contains the words to a 24-word see phrase in the right order.",
      RIGHT_ORDER,
      undefined,
      { date: "2026-03-16" },
    ),
  ];

  /** The author's own word for it: the seed's words sit in the book, in order. */
  static readonly techniques = [technique("hidden-seed-words", RIGHT_ORDER)];

  /** Builds the canonical collection. */
  constructor() {
    super(
      WalkingBanksCollection.key,
      WalkingBanksCollection.author,
      WalkingBanksCollection.puzzles,
      WalkingBanksCollection.hints,
      WalkingBanksCollection.techniques,
    );
  }
}

/** Canonical collection instance. */
export const walkingBanks = new WalkingBanksCollection();
