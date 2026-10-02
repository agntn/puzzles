import { SingletonCollection } from "../core/collection.ts";
import {
  assets,
  community,
  decrease,
  digest,
  encryptedWif,
  fact,
  funding,
  increase,
  official,
  party,
  PartyKind,
  profile,
  technique,
  uncompressed,
} from "../core/parts.ts";
import { puzzle } from "../core/puzzle.ts";

/** The post: the paper wallet, its encrypted key, the address and the passphrase left to find. */
const THREAD = "https://stacker.news/items/275973";

/** The paper wallet picture the post links to. The file under `assets/` is what Imgur serves for it. */
const PICTURE = "https://i.imgur.com/3RSb8MH.png";

/**
 * A comment below the post, by its item id.
 *
 * @param {string} id - The item id Stacker News gives the comment.
 * @returns {string} The comment's permalink.
 */
function comment(id: string): string {
  return `https://stacker.news/items/${id}`;
}

/**
 * A bitaddress.org paper wallet whose BIP38 passphrase its owner forgot. q posted the encrypted
 * key and the address and gave the coins to whoever brute forces the passphrase. The payload is
 * the EC multiply kind, for an uncompressed key, and its address hash matches the address below.
 */
export const bruteForce = puzzle({
  id: "bitaddress",
  chain: "bitcoin",
  address: "1J7BVeP8JK4op2X3GN3Hy7xkTnGnQTMpou",
  sourceUrl: THREAD,
  startedAt: "2023-10-06 11:50:09",
  pubkey: uncompressed(
    "04f7af13c4fda2f920dbd8ebc8d2cc87cdc6674a7beda95a402ab83dd7e952597aeebdb76b2b4bc15771c57eb48568b2a8fa83219f9fa53519aaef5cd75bac30ac",
  ),
  key: encryptedWif("6PfQTphCYc1Fee19uPz2pmou5RVBDVgw8VcrPfGLos4ktUnARdiFLYhcNU"),
  techniques: [technique("bip38", THREAD)],
  prize: 0.005297,
  hints: [
    official("I suspect the passphrase is not more than 30 characters.", THREAD, undefined, {
      date: "2023-10-06",
    }),
    official("Which i generated on this site https://www.bitaddress.org/", THREAD, undefined, {
      date: "2023-10-06",
    }),
    official(
      "I don't remember, I have tested my passwords I used during that time, so probably it is not with special characters",
      comment("276117"),
      undefined,
      { date: "2023-10-06" },
    ),
    official(
      "Most likely I did not use a passphrase of the length 30. But I remeber that I used to combine 3 different passwords to secure wallets which is about that length. I have withdrawn funds from the wallet once so it cannot be an imposible passpharse and most likely I did not used a password manager for it.",
      comment("276305"),
      undefined,
      { date: "2023-10-06" },
    ),
    community(
      "The private key starts with '6Pf', though. That gives you some indication of the encryption algorithm used: EC multiply, no compression, no lot/sequence numbers, according to BIP38.",
      comment("276026"),
      undefined,
      { date: "2023-10-06" },
    ),
  ],
  transactions: [
    funding(
      "cbba0edea0808f1a36a4f84663b9b0ef065939759f7257a80df2b14f773910ca",
      "2015-06-02 21:14:42",
      0.01337,
    ),
    increase(
      "fd82c2f779c4cf8e56e10430d7ae45ace0025090600ae2fd3fd3d467d9ebf608",
      "2015-06-02 21:14:42",
      0.02999,
    ),
    decrease(
      "fa938636d8b5f0f82a7f88af68dfaf0973436525cd0d524a823fe4409c17f3c9",
      "2016-06-12 19:15:59",
      0.038063,
    ),
  ],
  assets: assets({
    puzzle: "puzzle.png",
    sourceUrl: PICTURE,
    digests: [
      digest(
        "puzzle.png",
        "07d729b09d2757cefff0a2f104ed3d7fc7e60d43822dc86038b122a68c81cc64",
        215666,
        { url: "https://i.imgur.com/3RSb8MH.png" },
      ),
    ],
  }),
});

/** Brute force and the coins are yours, one bitaddress.org paper wallet by q. */
export class BitaddressCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "bitaddress";

  /** Who published the puzzle. */
  static readonly author = party("q", {
    key: "q",
    kind: PartyKind.Person,
    about:
      "Stacker News account that gave away a paper wallet whose BIP38 passphrase it had forgotten, to whoever could brute force it.",
    profiles: [profile("stackernews", "https://stacker.news/q")],
    facts: [
      fact(
        "Posted the encrypted key and the address of a bitaddress.org paper wallet made some years earlier, whose passphrase q no longer remembered.",
        THREAD,
        { date: "2023-10-06" },
      ),
      fact(
        "Called the giveaway a demonstration that a passphrase is not an extra security layer, only an extra step before the coins go to every bitcoiner.",
        THREAD,
        { date: "2023-10-06" },
      ),
      fact(
        "Took the name q when Stacker News was new and single letters were still free, because it was the first random letter nobody used.",
        comment("276411"),
        { date: "2023-10-06" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [bruteForce];

  /** Builds the canonical collection. */
  constructor() {
    super(BitaddressCollection.key, BitaddressCollection.author, BitaddressCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const bitaddress = new BitaddressCollection();
