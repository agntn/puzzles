import { SingletonCollection } from "../core/collection.ts";
import {
  answer,
  artifact,
  assets,
  decrease,
  fact,
  funding,
  p2pkh,
  party,
  PartyKind,
  profile,
  stage,
  uncompressed,
} from "../core/parts.ts";
import { bitcoinPuzzle } from "../core/puzzle.ts";

/** The community writeup of every published step, pinned to the commit the answers cite. */
const WRITEUP =
  "https://github.com/puzzlehunt/gsmgio-5btc-puzzle/blob/fb92dd15487c6e2d275adb8c923698b7166c328e/README.md";

/** The page that carries both ciphertexts, the one the phase 1 answer opens. */
const CHOICE =
  "https://gsmg.io/choiceisanillusioncreatedbetweenthosewithpowerandthosewithoutaveryspecialdessertiwroteitmyself";

/** The SHA-256 of the text on the first image, the page with SalPhaseIon and Cosmic Duality. */
const SALPHASEION =
  "https://gsmg.io/89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32";

/** GSMG.IO multi-phase cryptographic challenge. */
export const gsmgPuzzle = bitcoinPuzzle({
  id: "gsmg",
  address: p2pkh("1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe", "a9553269572a317e39f0f518cb87c1a0ee1dbae4"),
  sourceUrl: "https://gsmg.io/puzzle",
  startedAt: "2019-04-13 16:32:40",
  pubkey: uncompressed(
    "04f4d1bbd91e65e2a019566a17574e97dae908b784b388891848007e4f55d5a4649c73d25fc5ed8fd7227cab0be4e576c0c6404db5aa546286563e4be12bf33559",
  ),
  prize: 1.25364181,
  transactions: [
    funding(
      "73e48ff571a7e9a4387574a50cf2fcb7b21b6ea5702c777a035664df57cbce02",
      "2019-04-13 16:32:40",
      5,
    ),
    decrease(
      "2aa9a4a90be819d5122d70c993280785a0508f163521e7b38cebb4db0b071b13",
      "2020-05-11 20:02:50",
      2.5,
    ),
    decrease(
      "88cdb3cdca12b471551b1b26188508a14ca5fd8a415223ffb7c190381c9b9df3",
      "2024-04-24 21:47:27",
      1.25,
    ),
  ],
  assets: assets({
    puzzle: "puzzle.png",
    hints: ["follow-the-white-rabbit.png"],
    sourceUrl: "https://gsmg.io/puzzle",
  }),
  stages: [
    stage(
      "phase 1",
      "A 14 by 14 grid of black, white, blue and yellow squares with a pixel rabbit in the middle. The one real QR code sits at the bottom and only opens the address on blockchain.com, so no, that's not the shortcut. Read the grid right and you land on a page with eight pictures, a password form hidden with display: none and a comment in the source wishing luck to the little bunny hunter.",
      [
        artifact("puzzle image", "https://gsmg.io/puzzle", "puzzle.png"),
        artifact("the seed is planted", "https://gsmg.io/theseedisplanted"),
      ],
      answer(
        "The grid read as bits, black and blue 1, white and yellow 0, counterclockwise in a spiral from the top left, spells gsmg.io/theseedisplanted, and the hidden form there takes theflowerblossomsthroughwhatseemstobeaconcretesurface.",
        `${WRITEUP}#1-httpsgsmgiopuzzle`,
        { date: "2020-04-26" },
      ),
    ),
    stage(
      "phase 2",
      "The page opens with someone asking if you're looking for the private keymaker, then drops a base64 AES blob on you. After that it gets weird: a riddle about an electrical network theorem, a chancellor waiting for banks to be bailed out, a chess position in FEN and a buddhist who is forced to move.",
      [artifact("ciphertext", CHOICE, "phase2.txt")],
      answer(
        "causality, from the Merovingian in The Matrix Reloaded. Its SHA-256 in lowercase hex, eb3efb5151e6255994711fe8f2264427ceeebf88109e1d7fad5b0a8b6d07e5bf, is the OpenSSL password.",
        `${WRITEUP}#3-httpsgsmgiochoiceisanillusioncreatedbetweenthosewithpowerandthosewithoutaveryspecialdessertiwroteitmyself`,
        { date: "2020-04-26" },
      ),
    ),
    stage(
      "phase 3",
      "A second blob on the same page, about six times the first one. This time the author says how to open it: parts 1 to 7 go through sha-256 and the digest is the password. Same aes-256-cbc as before, so at least the lock is familiar.",
      [artifact("ciphertext", CHOICE, "phase3.txt")],
      answer(
        "causality, Safenet, Luna, HSM, 11110, 0x736B6E616220726F662074756F6C69616220646E6F63657320666F206B6E697262206E6F20726F6C6C65636E61684320393030322F6E614A2F33302073656D695420656854 and B5KR/1r5B/2R5/2b1p1p1/2P1k1P1/1p2P2p/1P2P2P/3N1N2 b - - 0 1, joined and hashed: 1a57c572caf3cf722e41f5f9cf99ffacff06728a43032dd44c481c77d2ec30d5. Inside is phase 3.1 and one more blob, phase 3.2, that opens with the SHA-256 of jacquefrescogiveitjustonesecondheisenbergsuncertaintyprinciple.",
        `${WRITEUP}#3-httpsgsmgiochoiceisanillusioncreatedbetweenthosewithpowerandthosewithoutaveryspecialdessertiwroteitmyself`,
        { date: "2020-04-26" },
      ),
    ),
    stage(
      "SalPhaseIon",
      "A back door in the first image. The page path is the SHA-256 of the text printed under the grid, and behind it sits one long line of mostly the letters a to i, with a few words mixed in and a base64 blob split into single characters. The blob opens with Salted__, which says OpenSSL made it, not which cipher or key derivation. Parts of the letters decode. The writeup has no password for the blob.",
      [artifact("letters and blob", SALPHASEION, "salphaseion.txt")],
    ),
    stage(
      "Cosmic Duality",
      "Same page, second heading. A clean 28 line base64 blob with the same Salted__ header and not one word about its cipher or password. The writeup stops here and has no password for it.",
      [artifact("ciphertext", SALPHASEION, "cosmic-duality.txt")],
    ),
  ],
});

/** GSMG.IO multi-phase cryptographic challenge. */
export class GsmgCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "gsmg";

  /** Who published the puzzles. */
  static readonly author = party("GSMG.io", {
    key: "gsmg",
    kind: PartyKind.Organization,
    about:
      "A crypto trading bot platform that ran from 2017 to 2026 and left a multi phase puzzle behind. The site now shows the lights off and one mystery left.",
    addresses: ["1EtbTvVB8QTGN4mduSdy7n4cZQm4iYTpQ1"],
    profiles: [
      profile("website", "https://gsmg.io/puzzle"),
      profile("website", "https://gsmg.io/"),
    ],
    facts: [
      fact(
        "The front page says: A fully automated crypto trading bot. 2017 to 2026. The lights are off. Nine years of chaos ended. One mystery remains. Follow the white rabbit.",
        "https://gsmg.io/",
      ),
      fact(
        "Funded the puzzle address with 5 BTC on 2019-04-13.",
        "https://blockstream.info/tx/73e48ff571a7e9a4387574a50cf2fcb7b21b6ea5702c777a035664df57cbce02",
        { date: "2019-04-13" },
      ),
      fact(
        "Halved the prize at the 2020 halving and again in April 2024, moving 2.5 BTC and then 1.25 BTC to 17ucy1K9ZUAaoY6JVtM932W9jUp5LXfyHa.",
        "https://blockstream.info/tx/88cdb3cdca12b471551b1b26188508a14ca5fd8a415223ffb7c190381c9b9df3",
        { date: "2024-04-24" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [gsmgPuzzle];

  /** Builds the canonical collection. */
  constructor() {
    super(GsmgCollection.key, GsmgCollection.author, GsmgCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const gsmg = new GsmgCollection();
