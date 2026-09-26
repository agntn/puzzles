import { SingletonCollection } from "../core/collection.ts";
import {
  assets,
  claim,
  compressed,
  fact,
  funding,
  official,
  p2wpkh,
  party,
  PartyKind,
  profile,
  seed,
} from "../core/parts.ts";
import { bitcoinPuzzle, Status } from "../core/puzzle.ts";

/**
 * Bitcoin Movie Enigma: 34 film stills, each title turned into a BIP39 word, ten intruders to
 * drop. The 24 words that remain fail the BIP39 checksum and still derive the funded address.
 */
export const movieEnigmaPuzzle = bitcoinPuzzle({
  id: "movie-enigma",
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
  hints: [
    official(
      "Guess all the 34 movie titles, from the provided movie frames",
      "https://bitcoinmovieenigma.com/rules",
    ),
    official(
      'Transform "somehow" each movie title into an English BIP-0039 seed word',
      "https://bitcoinmovieenigma.com/rules",
    ),
    official(
      'The seedphrase you have is 34 words long, but we should have a 24 words seedphrase instead. Some movies should not be in the sequence, and should be considered intruders, but which ones ? You will need additional informations about each movie to detect those intruders "somehow". Every information you need can be found on IMBD, on each movie\'s page',
      "https://bitcoinmovieenigma.com/rules",
    ),
  ],
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
    key: "rabbidbird",
    about:
      "GitHub user who solved the Bitcoin Movie Enigma after four and a half years, by not trusting the BIP39 checksum.",
    addresses: ["35h2x1Rqq3HmV1NX4KQAGZoz8Vmf42ktQT"],
    profiles: [profile("github", "https://github.com/rabbidbird")],
    facts: [
      fact(
        "Announced the claim in floflo777's open-crypto-puzzles tracker, with the ten intruders and the five movie groups that pick them.",
        "https://github.com/floflo777/open-crypto-puzzles/issues/24",
        { date: "2026-09-08" },
      ),
      fact(
        "Found that the winning phrase fails the BIP39 checksum and still derives the address, which is why searches that filter by checksum threw it away.",
        "https://github.com/floflo777/open-crypto-puzzles/issues/24",
        { date: "2026-09-08" },
      ),
      fact(
        "Thanked the contributors of issue 9 in the same tracker for settling which film each frame shows.",
        "https://github.com/floflo777/open-crypto-puzzles/issues/24",
        { date: "2026-09-08" },
      ),
    ],
  }),
  assets: assets({
    solution: "solution.md",
    sourceUrl: "https://github.com/floflo777/open-crypto-puzzles/issues/24",
  }),
});

/** Bitcoin Movie Enigma, one puzzle by klems. */
export class MovieEnigmaCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "movie-enigma";

  /** Who published the puzzles. */
  static readonly author = party("klems", {
    key: "klems",
    kind: PartyKind.Person,
    aliases: ["cryptop1r4t3"],
    about:
      "Pseudonymous puzzle maker who signs the movie frames as @cryptop1r4t3 and keeps a Nostr key as the only contact.",
    profiles: [
      profile("website", "https://bitcoinmovieenigma.com"),
      profile("twitter", "https://x.com/cryptop1r4t3"),
      profile(
        "nostr",
        "https://njump.me/npub10q5dpm5p05a0g3vtgcl76wv0pc4t820f5fj8qmpfaa4umv6404xqvwzvp0",
      ),
    ],
    facts: [
      fact(
        "Announced the puzzle on X on 2022-03-21 as 80% movie quiz and 20% reflexion.",
        "https://x.com/cryptop1r4t3/status/1505915271118262286",
        { date: "2022-03-21" },
      ),
      fact(
        "The about page says the enigma went out first on Twitter, Instagram and Nostr, and the website came after those platforms compressed the frames badly.",
        "https://bitcoinmovieenigma.com/about",
      ),
      fact(
        "Every one of the 34 frames carries @cryptop1r4t3 in its EXIF Artist and XMP creator fields, next to an ImageDescription that reads nope.",
        "https://www.bitcoinmovieenigma.com/alternative",
      ),
      fact(
        "Funded the prize alone, 100,000 sats on 2022-04-08, and the donor list on the wallet page never grew past that one entry.",
        "https://bitcoinmovieenigma.com/wallet",
        { date: "2022-04-08" },
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
