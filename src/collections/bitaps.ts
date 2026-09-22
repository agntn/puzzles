import { SingletonCollection } from "../core/collection.ts";
import {
  compressed,
  derivation,
  fact,
  funding,
  increase,
  p2wpkh,
  party,
  PartyKind,
  profile,
  share,
} from "../core/parts.ts";
import { bitcoinPuzzle } from "../core/puzzle.ts";

/** Bitaps Shamir secret-sharing puzzle. */
export const bitapsPuzzle = bitcoinPuzzle({
  id: "bitaps",
  address: p2wpkh(
    "bc1qyjwa0tf0en4x09magpuwmt2smpsrlaxwn85lh6",
    "249dd7ad2fccea67977d4078edad50d8603ff4ce",
  ),
  sourceUrl: "https://bitaps.com/mnemonic/challenge",
  startedAt: "2020-06-19 13:24:41",
  pubkey: compressed("0385a3a591451ed7ed6c90dae882db918107d6f906d270cf4728d168126e0e89aa"),
  key: derivation("m/84'/0'/0'/0/0")
    .xpub(
      "zpub6qdEDkv51FpxX6g1rpFGckmiL46vV8ccmtEgPAkj3qj8N4ZZHyXDRA9RwpTiFK2Kb8vRaDmSmwgX6rfB4t2K8Ktdq8ExQ6fumKpn2ndJCqL",
    )
    .shares(3, 5, [
      share(1, "session cigar grape merry useful churn fatal thought very any arm unaware"),
      share(
        2,
        "clock fresh security field caution effort gorilla speed plastic common tomato echo",
      ),
    ]),
  prize: 1.00016404,
  transactions: [
    funding(
      "a24e37411d1860c51a71a2f0c2bb1561ed40c7d8bb724f5faa3dfcb0a99925e6",
      "2020-06-19 13:24:41",
      1,
    ),
    increase(
      "bb0b6c3198c7274469b68fd5e2a5031dd31ce4c82a0aa2688f76c53d7cc8f167",
      "2021-11-29 12:20:03",
      0.00008781,
    ),
    increase(
      "fe3f6d1f4536bbea7a84c8b5947caf407d69e0740c789277272a185c402ec14d",
      "2022-02-05 20:43:56",
      0.00002403,
    ),
    increase(
      "910c4c6af9bd8790645de7827ef33aa9a750b89b0353c749d1edbd5925a1b272",
      "2022-10-13 00:48:34",
      0.0000522,
    ),
  ],
});

/** Bitaps Shamir secret-sharing puzzle. */
export class BitapsCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "bitaps";

  /** Who published the puzzles. */
  static readonly author = party("Bitaps", {
    key: "bitaps",
    kind: PartyKind.Organization,
    about:
      "The team behind the bitaps.com block explorer and the pybtc and jsbtc libraries whose Shamir secret sharing the challenge dares you to break.",
    profiles: [
      profile("website", "https://bitaps.com"),
      profile("github", "https://github.com/bitaps-com"),
    ],
    facts: [
      fact(
        "Maintains pybtc and jsbtc, Bitcoin libraries in Python and JavaScript under GPL-3.0, next to btcapiserver and a mnemonic tool for offline use.",
        "https://github.com/bitaps-com",
      ),
      fact(
        "Published two of the five Shamir shares of a 12 word mnemonic and pays 1 BTC for breaking the scheme or the implementation.",
        "https://bitaps.com/mnemonic/challenge",
      ),
      fact(
        "Turned the puzzle into a bug bounty in 2021: 1 BTC more for the published attack, 0.1 BTC for a bug that loses access to a correct set of shares, 0.05 BTC and up for other implementation bugs.",
        "https://bitaps.com/mnemonic/challenge",
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [bitapsPuzzle];

  /** Builds the canonical collection. */
  constructor() {
    super(BitapsCollection.key, BitapsCollection.author, BitapsCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const bitaps = new BitapsCollection();
