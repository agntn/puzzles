import { SingletonCollection } from "../core/collection.ts";
import {
  answer,
  assets,
  claim,
  community,
  fact,
  funding,
  hex,
  official,
  p2pkh,
  party,
  PartyKind,
  profile,
  uncompressed,
} from "../core/parts.ts";
import { bitcoinPuzzle, Status } from "../core/puzzle.ts";

/** The post: the picture, the address, two edits with clues and, once it was claimed, the solution. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/1tifs1/easy_1mbtc_picture_puzzle/";

/** Where the picture was posted. The file under `assets/` is what Imgur serves for it. */
const PICTURE = "https://i.imgur.com/Gm9ldPp.png";

/**
 * A comment in the thread, by its id.
 *
 * @param {string} id - The comment id Reddit prints after `t1_`.
 * @returns {string} The comment's permalink.
 */
function comment(id: string): string {
  return `https://www.reddit.com/r/bitcoinpuzzles/comments/1tifs1/comment/${id}/`;
}

/** The solution the author added to the post after the prize was claimed. */
const SOLUTION =
  'When sounded out the first three spell "directory.io" The QR code reveals "00110011001101100010000001100100011011110111011101101110" which when translated to text is "36 down". Entering directory.io/00110011001101100010000001100100011011110111011101101110 in your browser takes you to a page full of bitcoin addresses and private keys. Starting from the top of the page and counting "36 down" you end up with the address and private key of the competition.';

/**
 * Four pictures: a phone directory, an eye, the letter O and a QR code. Sounded out, the first
 * three give directory.io, a site that listed every private key 128 to a page. The QR code holds
 * "36 down" in binary, and the same binary digits are the page number. The author's solution stops
 * at the page, so the key is the recipe run once. The digits only lead to the prize read as octal,
 * a page starts at key 128 * (page - 1), and its 36th row derives the uncompressed address below.
 */
export const picturePuzzleRecord = bitcoinPuzzle({
  id: "picture-puzzle",
  address: p2pkh("1MeQumbMGbTDPUNtBbLwzfyZqeeZzpRnex", "e275dd7b615b5dd80e4fd298255bcc9ff42692bc"),
  sourceUrl: THREAD,
  startedAt: "2013-12-23 05:40:33",
  status: Status.Solved,
  pubkey: uncompressed(
    "0443363aa63ab32ed94309fbaf2783e6f4dc0878cc04b2f6c954b5345ade0c11da8be5ef87dfd13126fa6884bd7c7440a4f70be75af1d7fb1a9480608a3acbadcf",
  ),
  key: hex("00000000000000000000004804804824004000024020024124824824824123a3").derived(),
  prize: 0.001,
  hints: [
    official(
      "Everything you need to get the 1mBTC is contained in the picture. It's a very easy puzzle, but it may be a little harder than it first appears.",
      THREAD,
      undefined,
      {
        date: "2013-12-23",
        answer: answer(SOLUTION, THREAD, { date: "2013-12-23" }),
      },
    ),
    official(
      'Every CLUE that you need is in the picture. Just realized my OP may be confusing. To rephrase, "the picture will lead you to the private key".',
      THREAD,
      undefined,
      { date: "2013-12-23" },
    ),
    official(
      "The QR code needs to be used two different ways. Firstly it must be used \"as is\". This is important to get you to where you need to go. Once you're there use the decoded instruction to point you in the right direction. Hopefully now we're all on the same *page*.",
      THREAD,
      undefined,
      { date: "2013-12-23" },
    ),
    official(
      "You're on the right track. It's not a book though. Think of another word :)",
      comment("ce8dx3n"),
      undefined,
      {
        date: "2013-12-23",
        answer: answer("1 = Directory 2 = Eye 3 = 'O' 4 = QR Code", THREAD, { date: "2013-12-23" }),
      },
    ),
    official(
      "Not exactly. When you get to where you need to go, follow the clue ;)",
      comment("ce8der1"),
      undefined,
      { date: "2013-12-23" },
    ),
    official(
      "Try throwing the binary in your browser, you'll never know where you end up ;)",
      comment("ce8ecx8"),
      undefined,
      { date: "2013-12-23" },
    ),
    community("Book, Eye, Letter O, 36 Down... interesting", comment("ce8dw8t"), undefined, {
      date: "2013-12-23",
    }),
  ],
  solvedAt: "2013-12-23 10:39:50",
  solveTime: 17957,
  transactions: [
    funding(
      "0519cc7068fe31f543185203cebac565f228a46b5a9eaf1a53f7e88a91201cd7",
      "2013-12-23 05:41:54",
      0.001,
    ),
    claim(
      "24a43b26d8988238a77a43ff7ee3f62c4cc72db27323e685afe3155c235cc63a",
      "2013-12-23 10:39:50",
      0.0009,
    ),
  ],
  solver: party("6loss", {
    key: "6loss",
    about: "Reddit user who claimed the 1 mBTC picture puzzle five hours after it went up.",
    profiles: [profile("reddit", "https://www.reddit.com/user/6loss/")],
    facts: [
      fact(
        "Wrote Claimed =) under the post and promised to fund a new puzzle with the prize.",
        comment("ce8efwb"),
        { date: "2013-12-23" },
      ),
      fact(
        "givesadvice4bitcoin congratulated the claim and named 6loss the winner in the edited post.",
        comment("ce8eg7y"),
        { date: "2013-12-23" },
      ),
    ],
  }),
  assets: assets({ puzzle: "puzzle.png", sourceUrl: PICTURE }),
});

/** The 1 mBTC picture puzzle, one puzzle by givesadvice4bitcoin. */
export class PicturePuzzleCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "picture-puzzle";

  /** Who published the puzzle. */
  static readonly author = party("givesadvice4bitcoin", {
    key: "givesadvice4bitcoin",
    kind: PartyKind.Person,
    about:
      "Posted a picture puzzle on r/bitcoinpuzzles seven hours after the subreddit opened. Four pictures, 1 mBTC, marked easy, and a little harder than it looked.",
    profiles: [profile("reddit", "https://www.reddit.com/user/givesadvice4bitcoin/")],
    facts: [
      fact(
        "Thanked IAMABananaAMAA for starting the subreddit, under the picture puzzle.",
        comment("ce8aocr"),
        { date: "2013-12-23" },
      ),
      fact(
        "Congratulated 6loss on the claim and added the full solution to the post.",
        comment("ce8eg7y"),
        { date: "2013-12-23" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [picturePuzzleRecord];

  /** Builds the canonical collection. */
  constructor() {
    super(
      PicturePuzzleCollection.key,
      PicturePuzzleCollection.author,
      PicturePuzzleCollection.puzzles,
    );
  }
}

/** Canonical collection instance. */
export const picturePuzzle = new PicturePuzzleCollection();
