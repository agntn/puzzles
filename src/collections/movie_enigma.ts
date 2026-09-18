import { SingletonCollection } from "../core/collection.ts";
import { assets, claim, compressed, funding, p2wpkh, party, profile, seed } from "../core/parts.ts";
import { bitcoinPuzzle, Status } from "../core/puzzle.ts";

/**
 * Bitcoin Movie Enigma: 34 film stills, each title turned into a BIP39 word, ten intruders to
 * drop. The 24 words that remain fail the BIP39 checksum and still derive the funded address.
 */
export const movieEnigmaPuzzle = bitcoinPuzzle({
  id: "movie_enigma",
  address: p2wpkh(
    "bc1q94ecsn0qk8lap2gefrycnms3ruepy889z969a6",
    "2d73884de0b1ffd0a91948c989ee111f32121ce5",
  ),
  sourceUrl: "https://bitcoinmovieenigma.com/rules",
  startedAt: "2022-04-08 16:15:24",
  status: Status.Solved,
  pubkey: compressed("022c17f7486b4107b42a243a62e4d0919af3e8ee858a272319bffb0536486b9405"),
  key: seed(
    "path mad alien apology escape spare miss goddess leopard crime visit clock start first blade guard close barrel term screen matrix toy ghost shine",
    "m/84'/0'/0'/0/0",
  ),
  prize: 0.001,
  solvedAt: "2026-09-08 01:32:56",
  solveTime: 139396652,
  transactions: [
    funding(
      "b8058e6f373096445e4c5072f163e9e24727a3f622e0135150a88d25e4fdb2a3",
      "2022-04-08 16:15:24",
      0.001,
    ),
    claim(
      "bd3b088164ae32458b97b917af8fab14056461c5e954499f7bd4cf3a67d6c5f4",
      "2026-09-08 01:32:56",
      0.00099766,
    ),
  ],
  solver: party("rabbidbird", {
    addresses: ["35h2x1Rqq3HmV1NX4KQAGZoz8Vmf42ktQT"],
    profiles: [profile("github", "https://github.com/rabbidbird")],
  }),
  assets: assets({
    solver: "solution.md",
    sourceUrl: "https://github.com/floflo777/open-crypto-puzzles/issues/24",
  }),
});

/** Bitcoin Movie Enigma, one puzzle by klems. */
export class MovieEnigmaCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "movie_enigma";

  /** Who published the puzzles. */
  static readonly author = party("klems", {
    profiles: [
      profile("website", "https://bitcoinmovieenigma.com"),
      profile("twitter", "https://x.com/cryptop1r4t3"),
      profile(
        "nostr",
        "https://njump.me/npub10q5dpm5p05a0g3vtgcl76wv0pc4t820f5fj8qmpfaa4umv6404xqvwzvp0",
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [movieEnigmaPuzzle];

  /** Builds the canonical collection. */
  constructor() {
    super(MovieEnigmaCollection.key, MovieEnigmaCollection.author, MovieEnigmaCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const movieEnigma = new MovieEnigmaCollection();
