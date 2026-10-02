import { SingletonCollection } from "../core/collection.ts";
import {
  assets,
  digest,
  confirmation,
  fact,
  funding,
  increase,
  official,
  p2pkh,
  party,
  PartyKind,
  profile,
} from "../core/parts.ts";
import { litecoinPuzzle } from "../core/puzzle.ts";

/** The hunt's page today: the clue images, the rules and the prize address. */
const SITE = "https://p2gtreasure.com/";

/** The first site, kept under `old/`: the gameplay demo, the prize and the donation address. */
const OLD = "https://p2gtreasure.com/old/index.html";

/** The first site as the Wayback Machine saw it on February 5, 2021, three days after the first coins. */
const CAPTURE = "https://web.archive.org/web/20210205193730/https://www.p2gtreasure.com/";

/** The site with the clue images as the Wayback Machine saw it on May 16, 2021. */
const CLUES_CAPTURE = "https://web.archive.org/web/20210516142206/https://www.p2gtreasure.com/";

/** The rules of the first site. */
const RULES = "https://p2gtreasure.com/old/rules.html";

/** The page about the game the demo belongs to. */
const GAME = "https://p2gtreasure.com/old/p2g.html";

/** The 50 second announcement trailer on the game's YouTube channel, February 5, 2021. */
const TRAILER = "https://www.youtube.com/watch?v=T98D6Otefgs";

/** The author's post on r/ARG, July 25, 2021. */
const ARG =
  "https://www.reddit.com/r/ARG/comments/orgh1k/i_made_a_treasure_hunt_with_a_crypto_prize/";

/** The author's reply under that post, a month later. */
const ARG_REPLY = `${ARG}haakcwj/`;

/** Seconds of Dream, the album Justin Patterson released on January 7, 2021. */
const ALBUM = "https://music.apple.com/us/album/seconds-of-dream/1548289299";

/** Seconds of Dream on the game's YouTube channel, posted in 2019 as the Path to Greatness soundtrack. */
const SOUNDTRACK = "https://www.youtube.com/watch?v=EojQgdZeTyM";

/**
 * Path to Greatness: Treasure Hunt. Clues inside a gameplay demo, later nine images on the site,
 * lead to the private key of a Litecoin wallet. The prize is whatever that wallet holds, and
 * donations to it raise the stakes.
 */
export const treasureHunt = litecoinPuzzle({
  id: "path-to-greatness",
  address: p2pkh("LUtL7qnm3gzxKjHcfVLSjydqhhinTVmTmS", "69fb2ecbe0eed5feeb7e410b279048cd3891b789"),
  sourceUrl: SITE,
  startedAt: "2021-02-05 19:02:37",
  prize: 3.02608794,
  hints: [
    official(
      "Clues can be found inside the demo, and will lead you to a Litecoin wallet's private key.",
      OLD,
      confirmation(CAPTURE, "Wayback capture of the first site, February 2021"),
    ),
    official("The first and last steps are the only steps I will ever provide.", RULES),
    official(
      "The clues above will lead to a Litecoin wallet's private key.",
      SITE,
      confirmation(CLUES_CAPTURE, "Wayback capture of the site with the clue images, May 2021"),
    ),
  ],
  transactions: [
    funding(
      "7f7a13c612ccc937fede4802b24861c00b386fc116a3a57d6a4e386e93f45f21",
      "2021-02-02 14:57:06",
      0.03477051,
    ),
    increase(
      "1e2e74c76942b40b4f79a9d98c5ba00eda553e4f8ea60e2fb15b9a85fdd039f0",
      "2021-02-05 15:53:48",
      0.06420958,
    ),
    increase(
      "af864bcaa7e86a3c1de5e33dc22d8d528a07e79c349a74244358b0f647be0666",
      "2021-02-05 15:53:48",
      0.57788622,
    ),
    increase(
      "cb2462b981de7768245bc1951575c163010e0ce6dc3d3f80499fe3fe5f551458",
      "2021-02-05 16:05:38",
      0.07233959,
    ),
    increase(
      "37319ffe3ac77c1a9c413e411347938e973400761cea3c7890dfe2f9d65dc834",
      "2021-02-12 18:14:43",
      0.06348393,
    ),
    increase(
      "ebe20c79330a96bfd789b716bfa0f579088fafbb62c877bb6395ec2f25c92b86",
      "2021-05-15 22:54:29",
      0.15546076,
    ),
    increase(
      "16abed94cd0641bda707b21fcb6a9caf614524ff3590645af104d075bca10638",
      "2021-05-22 23:08:52",
      0.15794155,
    ),
    increase(
      "b83f8e1037bd07d8e82b1c4c35a3727b2919e709eecd570f83ecb743c8fa2711",
      "2021-07-22 18:02:39",
      1.8999958,
    ),
  ],
  assets: assets({
    puzzle: "computer-screen.jpg",
    hints: [
      "clue1-imagine.jpg",
      "clue2-scramble.jpg",
      "clue3-wasd.jpg",
      "clue4-chess.jpg",
      "clue5-wonders.jpg",
      "00111111.jpg",
      "qr1.jpg",
      "qr2.jpg",
    ],
    sourceUrl: "https://p2gtreasure.com/Clues/p2g_clues.zip",
    digests: [
      digest(
        "computer-screen.jpg",
        "f14bdfc2a1bf532cdb7a2da6b30034bdd6d96478b37f664658d5678fb2d800f2",
        478546,
        {
          url: "https://p2gtreasure.com/Clues/computer_screen.jpg",
          archive:
            "https://web.archive.org/web/20220420084754id_/http://p2gtreasure.com/Clues/computer_screen.jpg",
        },
      ),
      digest(
        "clue1-imagine.jpg",
        "787861023f2d1ee6cc6d4ab21f9344f13b275cc6d0c2a03ea02a38c42724db5c",
        564308,
        {
          url: "https://p2gtreasure.com/Clues/clue1_imagine.jpg",
          archive:
            "https://web.archive.org/web/20220406031947id_/http://p2gtreasure.com/Clues/clue1_imagine.jpg",
        },
      ),
      digest(
        "clue2-scramble.jpg",
        "c6e07d7a53faafa17f2d57ee0971462da80494d79d0fcf3ebb39b9630dc92e5e",
        537001,
        {
          url: "https://p2gtreasure.com/Clues/clue2_scramble.jpg",
          archive:
            "https://web.archive.org/web/20220309153614id_/http://p2gtreasure.com/Clues/clue2_scramble.jpg",
        },
      ),
      digest(
        "clue3-wasd.jpg",
        "15c5fae68f242e2dc23f51100fac2ca574528c5284e737bda3cd59707a6e678b",
        556777,
        {
          url: "https://p2gtreasure.com/Clues/clue3_wasd.jpg",
          archive:
            "https://web.archive.org/web/20220403042134id_/http://p2gtreasure.com/Clues/clue3_wasd.jpg",
        },
      ),
      digest(
        "clue4-chess.jpg",
        "6603d1c29220e64b744d34704ec57f90560a6490d152fdb0ce8cc03a6da6a359",
        575085,
        {
          url: "https://p2gtreasure.com/Clues/clue4_chess.jpg",
          archive:
            "https://web.archive.org/web/20220309152900id_/http://p2gtreasure.com/Clues/clue4_chess.jpg",
        },
      ),
      digest(
        "clue5-wonders.jpg",
        "d348d9b36dc010e32c1b3689698c0d88793e031faf581214369fd229a793e119",
        609035,
        {
          url: "https://p2gtreasure.com/Clues/clue5_wonders.jpg",
          archive:
            "https://web.archive.org/web/20220502024511id_/http://p2gtreasure.com/Clues/clue5_wonders.jpg",
        },
      ),
      digest(
        "00111111.jpg",
        "91dfcca1727e3361c3d090a9ff4d90d97667dba0b7cf53263a9316510542e744",
        506238,
        {
          url: "https://p2gtreasure.com/Clues/00111111.jpg",
          archive:
            "https://web.archive.org/web/20220318211629id_/http://p2gtreasure.com/Clues/00111111.jpg",
        },
      ),
      digest("qr1.jpg", "d5b6bd00e6c84f7d2c7b60de168db885fdf5e2e0d2ce964a62dd887460a162f4", 13569, {
        url: "https://p2gtreasure.com/Clues/qr1.jpg",
        archive:
          "https://web.archive.org/web/20220417012026id_/http://p2gtreasure.com/Clues/qr1.jpg",
      }),
      digest("qr2.jpg", "120d72fde754740493e42627bbb561d5e7176429a9e221f24eef268346c1c2e9", 14009, {
        url: "https://p2gtreasure.com/Clues/qr2.jpg",
        archive:
          "https://web.archive.org/web/20220131185620id_/http://p2gtreasure.com/Clues/qr2.jpg",
      }),
    ],
  }),
});

/** Path to Greatness: Treasure Hunt, one Litecoin hunt by Justin Patterson. */
export class PathToGreatnessCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "path-to-greatness";

  /** Who published the puzzle. */
  static readonly author = party("Justin Patterson", {
    key: "justin-patterson",
    kind: PartyKind.Person,
    aliases: ["jpatt94"],
    about:
      "Game developer who hid a Litecoin treasure hunt in the gameplay demo of Path to Greatness, the 3D platformer he builds on his own, and signs the hunt's page as jpatt94.",
    profiles: [
      profile("website", SITE),
      profile("youtube", "https://www.youtube.com/@pathtogreatness8690"),
      profile("reddit", "https://www.reddit.com/user/jpatt94/"),
      profile("twitter", "https://x.com/jpatt94"),
    ],
    facts: [
      fact(
        "Develops Path to Greatness, a 3D platformer about parkour movement, on his own, and wrote that donations would help him hire a level designer.",
        GAME,
      ),
      fact(
        "Released the treasure hunt with a free gameplay demo of Path to Greatness and asked for donations to a second Litecoin address, half for the game and half for the prize.",
        CAPTURE,
      ),
      fact(
        "Announced the treasure hunt in a 50 second trailer on the game's YouTube channel, pointing to p2gtreasure.com.",
        TRAILER,
        { date: "2021-02-05" },
      ),
      fact(
        "Released Seconds of Dream, a 13 track album with Few and Far Between, Nocturnal Sugars and Seconds of Dream among its titles.",
        ALBUM,
        { date: "2021-01-07" },
      ),
      fact(
        "Posted Seconds of Dream on the game's YouTube channel as the Path to Greatness soundtrack.",
        SOUNDTRACK,
        { date: "2019-03-18" },
      ),
      fact(
        "Shared the hunt on r/ARG with 3 LTC in the wallet, about $375 at the time, because he was having a hard time finding a community that would enjoy solving it.",
        ARG,
        { date: "2021-07-25" },
      ),
      fact(
        "Wrote a month later that he knew of no online community working on the hunt, only a few private efforts through DMs he got.",
        ARG_REPLY,
        { date: "2021-08-25" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [treasureHunt];

  /** Builds the canonical collection. */
  constructor() {
    super(
      PathToGreatnessCollection.key,
      PathToGreatnessCollection.author,
      PathToGreatnessCollection.puzzles,
    );
  }
}

/** Canonical collection instance. */
export const pathToGreatness = new PathToGreatnessCollection();
