import { SingletonCollection } from "../core/collection.ts";
import {
  artifact,
  confirmation,
  fact,
  funding,
  increase,
  official,
  party,
  PartyKind,
  profile,
  stage,
  technique,
} from "../core/parts.ts";
import { puzzle } from "../core/puzzle.ts";

/** The riddle page: the rules, the address and the counter of words that can be found. */
const PAGE = "https://www.thegreatprint.net/riddle";

/** The oldest capture of the riddle page, May 2024, with its counter at block 832132. */
const FIRST_PAGE = confirmation(
  "https://web.archive.org/web/20240526060211/https://www.thegreatprint.net/riddle",
  "Wayback capture of the riddle page from May 2024",
);

/** The first capture that calls the words a recovery phrase, December 2024. */
const RECOVERY_PAGE = confirmation(
  "https://web.archive.org/web/20241203055908/https://www.thegreatprint.net/riddle",
  "Wayback capture of the riddle page from December 2024",
);

/** The first capture that allows more than one word per drawing, October 2025. */
const WORDS_PAGE = confirmation(
  "https://web.archive.org/web/20251010060719/https://www.thegreatprint.net/riddle",
  "Wayback capture of the riddle page from October 2025",
);

/** The first capture with the counter at four words, January 2026. */
const COUNTER_PAGE = confirmation(
  "https://web.archive.org/web/20260123202427/https://www.thegreatprint.net/riddle",
  "Wayback capture of the riddle page from January 2026",
);

/** Bitcoin Honey Badger, the fourth drawing of the Genesis Collection, with two of the words. */
const HONEY_BADGER = "https://www.thegreatprint.net/honeybadger";

/** The Great Tree, a later drawing of the Genesis Collection. */
const GREAT_TREE = "https://www.thegreatprint.net/greattree";

/** Bhoenix, whose page explains the riddle as a search game. */
const BHOENIX = "https://www.thegreatprint.net/bhoenix";

/** The Genesis Collection in the author's shop: the drawings the words are hidden in. */
const GENESIS_COLLECTION =
  "https://www.thegreatprint.net/shop?Kategorie=Genesis+Collection&Art+%26+Fashion=Genesis%2520Collection";

/** The artist page, where the author introduces himself. */
const ARTIST = "https://www.thegreatprint.net/artist";

/** The payment the riddle page links as its Signature TxId. */
const SIGNATURE =
  "https://mempool.space/tx/e1787c3811863b67e61dcc5804645de19f5927b980e3510cc6ba554064f7d720";

/** 24 seed words hidden in the original drawings, plus a 25th the artist sends to the finder. */
export const greatRiddleArtworks = puzzle({
  id: "great-riddle",
  chain: "bitcoin",
  address: "bc1qm3ayuhn7wppuqxaywu8ea0lggs8myy7543fekk",
  sourceUrl: PAGE,
  startedAt: "2024-02-26 14:17:17",
  preGenesis: true,
  techniques: [technique("hidden-seed-words", PAGE)],
  prize: 0.00423871,
  stages: [
    stage(
      "words",
      "Find the 24 words hidden in the original drawings of the Genesis Collection. The printed copies carry none, so the originals have to be seen in the studio in Basel or at an exhibition.",
      [artifact("riddle page", PAGE), artifact("Genesis Collection", GENESIS_COLLECTION)],
    ),
    stage(
      "25th word",
      "Send the 24 words, in any order, to the author. The first sender gets the 25th word that opens the address.",
      [artifact("riddle page", PAGE)],
    ),
  ],
  hints: [
    official(
      "Find the 24 hidden words of my bitcoin donation address and you can keep all the satoshis.",
      PAGE,
      FIRST_PAGE,
      { date: "2024-02-26" },
    ),
    official(
      "Find the 24 hidden words of my Bitcoin wallet's recovery phrase, and the entire balance is yours.",
      PAGE,
      RECOVERY_PAGE,
    ),
    official(
      "Every single word to the private key of this address: bc1qm3ayuhn7wppuqxaywu8ea0lggs8myy7543fekk is implemented on each original artwork of my Genesis Collection.",
      PAGE,
      FIRST_PAGE,
      { date: "2024-02-26" },
    ),
    official(
      "Each original drawing has 1 well hidden word implemented into the artwork.",
      PAGE,
      FIRST_PAGE,
      { date: "2024-02-26" },
    ),
    official(
      "Each original drawing has 1 (or more) well hidden word(s) implemented into the artwork. You can only find the words on the original artworks. (Important! My printed artworks do not have any hidden words intigrated!)",
      PAGE,
      WORDS_PAGE,
    ),
    official(
      "The first person to send me this 24 words (in any particular order) will get the 25th word for accessing the address.",
      PAGE,
      FIRST_PAGE,
      { date: "2024-02-26" },
    ),
    official(
      "Please note that with today's block time 927970 only 3 artworks are publicly visible/finished and therefore only 4 words can be found so far.",
      PAGE,
      COUNTER_PAGE,
      { date: "2025-12-15" },
    ),
    official(
      "Owners of a limited edition print or an original work of mine will receive all 100,000 blocks, all current words, via email, Twitter, or Telegram.",
      PAGE,
      WORDS_PAGE,
    ),
    official(
      "The original images of my Genesis Collection have hidden seed phrases that lead to a Bitcoin wallet that I created. With 24 images you are able to find the 24 phrases and get access to the Bitcoin wallet. I have named the search game The Great Riddle.",
      BHOENIX,
    ),
    official(
      "Two words from The Great Riddle Bitcoin wallet are hidden inside this artwork. Can you uncover them?",
      HONEY_BADGER,
    ),
    official(
      "My fourth artwork in the Genesis Series is now complete. This also means that the fourth word for my The Great Riddle Bitcoin wallet is now hidden within the artwork and publicly discoverable.",
      HONEY_BADGER,
    ),
    official(
      "As with other works in my Genesis series, this piece also contains a hidden word from one of my Bitcoin wallets.",
      GREAT_TREE,
    ),
  ],
  transactions: [
    funding(
      "34acef9e4d521d0b7087c74cf65a51b173a7b03bc33fa98e7c37321794c9243f",
      "2024-01-28 01:07:37",
      0.00025701,
    ),
    increase(
      "9f3b60636ec893d647d6136dc2a0c969b2c50daffa5f806a0b45a2711e785045",
      "2024-03-12 16:17:34",
      0.00375489,
    ),
    increase(
      "e1787c3811863b67e61dcc5804645de19f5927b980e3510cc6ba554064f7d720",
      "2024-09-23 13:47:13",
      0.000021,
    ),
    increase(
      "e706008431b7c6e416e69f722c8a95b5763817bb7bc7c92de8119180f0e8c9b0",
      "2024-10-04 16:22:20",
      0.00001234,
    ),
    increase(
      "8495cb41890ff4fd23f323156a3f9a5e274b66bc511e5cb9bbf600302a378137",
      "2024-10-09 19:00:07",
      0.00002121,
    ),
    increase(
      "19df1f532013c70b48545815896cf9544611ca3805b1cdbd5127d59bef3f78e7",
      "2024-11-05 23:33:49",
      0.00001,
    ),
    increase(
      "227fc97cc75d0f32c03e206c0107ac64d84c2d38e0a466a72c9db49e2a32c7a3",
      "2025-02-10 12:44:33",
      0.00001,
    ),
    increase(
      "5ba400f52ae8368ac0037c694d75138139a7a58db345763f06062e98c9ef5641",
      "2025-03-13 15:03:59",
      0.00001,
    ),
    increase(
      "b81ec8115c76cea870be065301549bfe0b04f565dccf171fef6b5d5aff9eda91",
      "2025-03-22 08:43:31",
      0.00000888,
    ),
    increase(
      "7d54aac937bffd238d88c9761c6091ca82640cbf05b622cb2874141da04c7bc4",
      "2025-03-22 09:15:51",
      0.00000888,
    ),
    increase(
      "a127f573b6883a43ee2e09ecc9a5d5db60675c68a75f61f55edd9b3cd8ad1e5b",
      "2025-04-08 08:24:39",
      0.00000666,
    ),
    increase(
      "ea2c2b10c947f49e803765e48c0359414179f826813ee308800e4b3506a8e75e",
      "2025-04-16 09:18:47",
      0.00000666,
    ),
    increase(
      "01d89191e154f2cf81bba6f84d19b709e8c52ae623a3a185ac65625c2bf373c2",
      "2025-05-23 09:03:48",
      0.00001,
    ),
    increase(
      "06a0dc290a0f59450a515dd7df3c04d8730a5157c91beba20311f88d0619a670",
      "2025-06-16 15:09:47",
      0.00001234,
    ),
    increase(
      "d662ab66200d61d659f9adbffdb0ce615c159e60d6e573474289e88c9613c4fd",
      "2025-07-22 12:57:49",
      0.00001234,
    ),
    increase(
      "2324b6d206cd737966f2c9858d7c3cd11502e210564db085cf1e6469c691003e",
      "2025-08-19 14:52:07",
      0.00000333,
    ),
    increase(
      "d8c053ad2b6a8ea41e0df5dead71c87ebe95039b7d05ed4cb4f50722405af322",
      "2025-09-17 15:53:45",
      0.00000888,
    ),
    increase(
      "336a6497809ec3d56565c6585a255439ff3a6079144ab08ab08207e98020576b",
      "2026-01-09 14:42:42",
      0.00001234,
    ),
    increase(
      "200f50fba3cd173edde68280fc3ff361d034f6dde105631e6795641cd1868368",
      "2026-05-13 13:38:27",
      0.000021,
    ),
    increase(
      "85be00c24afbb7912d1b52bb559c6824663aab9d4e5ecedd25cecc07ac691c53",
      "2026-06-23 20:26:35",
      0.0000032,
    ),
    increase(
      "f331f4e136ccf780cf7618f6854a4fe4e69d05500c7c3e691977f640ba3a5dfc",
      "2026-06-23 20:34:26",
      0.00000321,
    ),
    increase(
      "ce69cd4694b5352d8f44b8b2c9835890d458a69d559286ff648fedc7bac069a2",
      "2026-09-03 14:13:54",
      0.00002121,
    ),
    increase(
      "bb7b40251e148b59bc172a4aadec6595759ac8d7f32f12e4a290d05cae9be404",
      "2026-09-16 15:57:08",
      0.00000333,
    ),
  ],
});

/** The Great Riddle by The Great Print, a seed phrase hidden word by word in pen drawings. */
export class GreatRiddleCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "great-riddle";

  /** Who published the puzzle. */
  static readonly author = party("The Great Print", {
    key: "the-great-print",
    kind: PartyKind.Person,
    aliases: ["thegreatprint", "Bartosz Lewicki"],
    about:
      "Bitcoin artist in Basel who draws large ballpoint pen pieces and hides the words of a wallet seed in them.",
    profiles: [
      profile("website", "https://www.thegreatprint.net/"),
      profile("twitter", "https://x.com/thegreatprint"),
      profile("youtube", "https://www.youtube.com/channel/UCMnBFlLsMEQhcl5mwegbnCg"),
    ],
    facts: [
      fact(
        "Bartosz Lewicki founded The Great Print and draws Bitcoin art with ballpoint pens in his studio in Basel.",
        ARTIST,
      ),
      fact(
        "Signed the riddle on chain: 2100 sat to the prize address with the OP_RETURN text The Great Print running The Great Riddle.",
        SIGNATURE,
        { date: "2024-09-23" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [greatRiddleArtworks];

  /** Builds the canonical collection. */
  constructor() {
    super(GreatRiddleCollection.key, GreatRiddleCollection.author, GreatRiddleCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const greatRiddle = new GreatRiddleCollection();
