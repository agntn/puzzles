import { NamedCollection } from "../core/collection.ts";
import { confirmation, fact, official, party, profile } from "../core/parts.ts";
import { rushwalletPuzzle1 } from "./rushwallet/1.ts";
import { rushwalletPuzzle2 } from "./rushwallet/2.ts";
import { rushwalletPuzzle3 } from "./rushwallet/3.ts";
import { rushwalletPuzzle4 } from "./rushwallet/4.ts";
import { rushwalletPuzzle5 } from "./rushwallet/5.ts";
import { rushwalletPuzzle6 } from "./rushwallet/6.ts";
import { rushwalletPuzzle7 } from "./rushwallet/7.ts";
import { rushwalletPuzzle8 } from "./rushwallet/8.ts";
import { rushwalletPuzzle9 } from "./rushwallet/9.ts";
import { rushwalletPuzzle10 } from "./rushwallet/10.ts";
import { rushwalletPuzzle11 } from "./rushwallet/11.ts";
import { rushwalletPuzzle12 } from "./rushwallet/12.ts";
import { rushwalletPuzzle13 } from "./rushwallet/13.ts";
import { rushwalletPuzzle14 } from "./rushwallet/14.ts";
import { rushwalletPuzzle15 } from "./rushwallet/15.ts";
import { rushwalletPuzzle16 } from "./rushwallet/16.ts";
import { rushwalletPuzzle17 } from "./rushwallet/17.ts";
import { rushwalletPuzzle18 } from "./rushwallet/18.ts";
import { rushwalletPuzzle19 } from "./rushwallet/19.ts";
import { rushwalletPuzzle20 } from "./rushwallet/20.ts";
import { rushwalletPuzzle21 } from "./rushwallet/21.ts";
import { rushwalletPuzzle22 } from "./rushwallet/22.ts";
import { rushwalletPuzzle23 } from "./rushwallet/23.ts";
import { rushwalletPuzzle24 } from "./rushwallet/24.ts";
import { rushwalletPuzzle25 } from "./rushwallet/25.ts";
import { rushwalletPuzzle26 } from "./rushwallet/26.ts";
import { rushwalletPuzzle27 } from "./rushwallet/27.ts";
import { rushwalletPuzzle28 } from "./rushwallet/28.ts";
import { rushwalletPuzzle29 } from "./rushwallet/29.ts";
import { rushwalletPuzzle30 } from "./rushwallet/30.ts";

/** KryptoKit RushWallet brainwallet contest, 2014. */
export class RushwalletCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "rushwallet";

  /** Who published the puzzles. */
  static readonly author = party("Dmitri Kryptokov", {
    key: "dmitri-kryptokov",
    aliases: ["thisisarushwalletbrainwalletnooot", "DMTRI"],
    about:
      "The office worker from the RushWallet contest video, reused as the author persona of the puzzle by KryptoKit, the Toronto company behind the wallet.",
    addresses: ["1GShq18eb4V6uBtqgwxkmuPTUHCtyBcNYA"],
    profiles: [
      profile("soundcloud", "https://soundcloud.com/thisisarushwalletbrainwalletnooot"),
      profile("codepen", "https://codepen.io/dmitrikryptokov"),
    ],
    facts: [
      fact(
        "KryptoKit's press release names Dmitri as the character in the contest video, an office worker raising money for a quieter keyboard, and KryptoKit as a Toronto company founded in 2013 by Steven Dakh and Anthony Di Iorio.",
        "https://bitcoinmagazine.com/press-releases/kryptokit-releases-video-based-contest-showcase-power-bitcoin-brainwallets-1411503632",
        { date: "2014-09-23" },
      ),
      fact(
        "Two of the thirty contest passphrases carry the name: Dmitri Nancy Enrique on wallet 17 and Dmitri Enrique Nancy on wallet 28.",
        "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
      ),
      fact(
        "The SoundCloud account was created and used once, on 2014-10-23, for a remix of YT Cracker's Bitcoin Baron with a Morse code message in the bridge.",
        "https://soundcloud.com/thisisarushwalletbrainwalletnooot",
        { date: "2014-10-23" },
      ),
      fact(
        "The CodePen account has exactly one pen, Hidden Wallet, published the same day 27 minutes before the track.",
        "https://codepen.io/dmitrikryptokov/pen/qBGLJZ",
        { date: "2014-10-23" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [
    rushwalletPuzzle1,
    rushwalletPuzzle2,
    rushwalletPuzzle3,
    rushwalletPuzzle4,
    rushwalletPuzzle5,
    rushwalletPuzzle6,
    rushwalletPuzzle7,
    rushwalletPuzzle8,
    rushwalletPuzzle9,
    rushwalletPuzzle10,
    rushwalletPuzzle11,
    rushwalletPuzzle12,
    rushwalletPuzzle13,
    rushwalletPuzzle14,
    rushwalletPuzzle15,
    rushwalletPuzzle16,
    rushwalletPuzzle17,
    rushwalletPuzzle18,
    rushwalletPuzzle19,
    rushwalletPuzzle20,
    rushwalletPuzzle21,
    rushwalletPuzzle22,
    rushwalletPuzzle23,
    rushwalletPuzzle24,
    rushwalletPuzzle25,
    rushwalletPuzzle26,
    rushwalletPuzzle27,
    rushwalletPuzzle28,
    rushwalletPuzzle29,
    rushwalletPuzzle30,
  ];

  /** The contest's shared starting clue. */
  static readonly hints = [
    official(
      "Search for clues in the RushWallet Fundraiser video to unlock each wallet and claim the bitcoins.",
      "https://rushwallet.com/contest",
      confirmation(
        "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
        "The contest page gives this instruction and embeds the Fundraiser video (https://www.youtube.com/watch?v=sr8lBrtd9U4).",
      ),
    ),
  ];

  /** Builds the canonical collection. */
  constructor() {
    super(
      RushwalletCollection.key,
      RushwalletCollection.author,
      RushwalletCollection.puzzles,
      RushwalletCollection.hints,
    );
  }
}

/** Canonical collection instance. */
export const rushwallet = new RushwalletCollection();
