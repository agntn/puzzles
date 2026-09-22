import { NamedCollection } from "../core/collection.ts";
import { fact, party, PartyKind, profile } from "../core/parts.ts";
import { torchedH34r7s } from "./coin_artist/torched-h34r7s.ts";

/** Public art puzzles by coin_artist. */
export class CoinArtistCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "coin_artist";

  /** The painter collaborated with Rhea Myers on the encoding. */
  static readonly author = party("coin_artist", {
    key: "coin-artist",
    kind: PartyKind.Person,
    aliases: ["Marguerite deCourcelle"],
    about:
      "Crypto artist and game designer who painted TORCHED H34R7S with a wallet key inside, and later founded Blockade Games.",
    profiles: [profile("twitter", "https://x.com/coin_artist")],
    facts: [
      fact(
        "Made the painting at Easter 2015 with the artist Rob Myers, to close a series of Bitcoin puzzles called The Legend of Satoshi Nakamoto.",
        "https://www.cbc.ca/radio/asithappens/as-it-happens-friday-edition-1.4528357/this-painting-is-actually-a-bitcoin-puzzle-worth-more-than-40k-and-someone-finally-solved-it-1.4529176",
        { date: "2018-02-12" },
      ),
      fact(
        "Told Vice how the key went in: a 52 character WIF plus a marker phrase, XORed against a six bit ribbon cipher and painted as flame shapes and colours.",
        "https://www.vice.com/en/article/heres-the-solution-to-the-3-year-old-dollar50000-bitcoin-puzzle/",
      ),
      fact(
        "Sotheby's catalogued the physical painting under her name as the final piece of the puzzle chain revealing the code to the 1flamen6 wallet.",
        "https://www.sothebys.com/buy/d671da77-a5fe-4610-9477-082d4c86eb75/lots/0952dcd2-e85f-46d2-b83e-236a8e9129af",
      ),
      fact(
        "Introduced in a 2019 interview as founder and CEO of Blockade Games, a studio building puzzle games on blockchains.",
        "https://www.scarlettsieber.com/tech-tuesday/marguerite-decourcelle",
        { date: "2019-09-04" },
      ),
    ],
  });

  /** The final painting, not the earlier stages of the hunt. */
  static readonly puzzles = [torchedH34r7s];

  /** Builds the canonical collection. */
  constructor() {
    super(CoinArtistCollection.key, CoinArtistCollection.author, CoinArtistCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const coinArtist = new CoinArtistCollection();
