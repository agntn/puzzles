import { SingletonCollection } from "../core/collection.ts";
import {
  answer,
  artifact,
  assets,
  claim,
  community,
  compressed,
  confirmation,
  digest,
  fact,
  funding,
  increase,
  official,
  party,
  PartyKind,
  profile,
  seed,
  stage,
  sweep,
  technique,
} from "../core/parts.ts";
import { puzzle, Status } from "../core/puzzle.ts";

/** The author's post with the address and the rule that you have to stand in front of the wall. */
const ANNOUNCEMENT =
  "https://www.pboy-art.com/single-post/2019/01/06/Fresque-Libert%C3%A9-guidant-le-peuple-2019";

/** The author's solution, posted the evening of the claim, in French and English. */
const SOLUTION =
  "https://www.pboy-art.com/single-post/2019/01/13/Solution-de-l%C3%A9nigme-de-la-fresque-La-Libert%C3%A9-guidant-le-peuple-2019";

/** Antoine Ferron's account of the week it took, on bitcoin.fr. */
const NARRATIVE =
  "https://bitcoin.fr/recit-de-la-decouverte-des-bitcoins-dans-la-fresque-la-liberte-guidant-le-peuple-2019/";

/** The r/Bitcoin post with the photo, the address and the author's replies underneath. */
const THREAD =
  "https://www.reddit.com/r/Bitcoin/comments/adc601/street_art_treasure_hunt_with_a_bitcoin_puzzle/";

/** The HD photo of the whole mural the author linked in his first comment. */
const HD_PICTURE = "https://i.imgur.com/BOiXPzl.jpg";

/**
 * A comment under the r/Bitcoin post, by its id.
 *
 * @param {string} id - The comment id Reddit prints after `t1_`.
 * @returns {string} The comment's permalink.
 */
function comment(id: string): string {
  return `https://www.reddit.com/r/Bitcoin/comments/adc601/comment/${id}/`;
}

/**
 * A photo from the solution page, at the size Wix stores it.
 *
 * @param {string} id - The media id in the Wix URL.
 * @returns {string} The image URL.
 */
function photo(id: string): string {
  return `https://static.wixstatic.com/media/${id}.jpg`;
}

/** The fluorescent inscriptions around Marianne's head, under black light. */
const BLACK_LIGHT = photo("61405b_840f53ba499049108fadcd318e035978~mv2_d_3024_2682_s_4_2");

/** Delacroix in yellow vests on a Paris wall: six seed words in coloured strokes, six in UV ink. */
export const liberteGuidantLePeuple = puzzle({
  id: "liberte-guidant-le-peuple",
  chain: "bitcoin",
  address: "1NqPwPp7hEXZ3Atj77Ue11xAEMmXqAXwrQ",
  sourceUrl: ANNOUNCEMENT,
  startedAt: "2019-01-06 22:42:07",
  preGenesis: true,
  status: Status.Solved,
  pubkey: compressed("030da6e3531173a850a6613475ba0d9db7af41ff5005d89e73e82089065581655c"),
  key: seed(
    "banquier usure mensonge peuple combat espoir union citoyen conduire triomphe horizon jaune",
    "m/44'/0'/0'/0/0",
  ).language("french"),
  prize: 0.28916308,
  techniques: [technique("hidden-seed-words", SOLUTION)],
  stages: [
    stage(
      "seed 12 words",
      "Black paint on black at the far right of the mural says what to look for.",
      [
        artifact(
          "black on black inscription",
          photo("61405b_e3b80810d6c94564a501350dfd6bc791~mv2"),
        ),
      ],
      answer(
        'Tout à droite de la fresque, en noir sur noir, il est écrit "Seed 12 words" (en français "graine 12 mots"), qui nous indique qu\'on doit chercher une "Seed" de 12 mots dans l\'ordre qui permettent de restaurer un portefeuille Bitcoin afin d\'avoir accès aux fonds.',
        SOLUTION,
        { date: "2019-01-13" },
      ),
    ),
    stage(
      "colour strokes",
      "Six zones of coloured strokes in the background, six base colours, two strokes per letter.",
      [
        artifact(
          "colour zones 1 to 4",
          photo("61405b_c5c174eba24942fdb6da04d873949dce~mv2_d_1649_1291_s_2"),
        ),
        artifact(
          "colour zones 5 and 6",
          photo("61405b_ac11f93b7bef4f01a43b859fdf910676~mv2_d_1649_1296_s_2"),
        ),
        artifact(
          "the author's colour table",
          photo("61405b_d363efc4ed9a4a818cfccc2fadee82c5~mv2_d_3024_3336_s_4_2"),
        ),
      ],
      answer("banquier usure mensonge peuple combat espoir", SOLUTION, { date: "2019-01-13" }),
    ),
    stage(
      "caesar",
      "ATOUT and JPAVFLU, painted in ink that glows under black light above Marianne's head.",
      [artifact("black light inscriptions", BLACK_LIGHT)],
      answer(
        "Les deux premiers mots sont codés en chiffrement de César. Avec respectivement un décalage de 20 et 19, ce qui nous donne : union citoyen",
        SOLUTION,
        { date: "2019-01-13" },
      ),
      [technique("caesar", SOLUTION)],
    ),
    stage(
      "base64",
      "Y29uZHVpcmU= and dHJpb21waGU=, in the same fluorescent paint.",
      [artifact("black light inscriptions", BLACK_LIGHT)],
      answer(
        "Les deux suivants sont codés en Base64, ce qui nous donne : conduire triomphe",
        SOLUTION,
        {
          date: "2019-01-13",
        },
      ),
      [technique("base64", SOLUTION)],
    ),
    stage(
      "aes",
      "mq+cC6Ax2+8R8LAnEWgQnA==, AES-128, with a key the author emailed to whoever found the inscriptions.",
      [artifact("black light inscriptions", BLACK_LIGHT)],
      answer(
        "Cette clé est : 03012009 (date du Bloc Genesis de Bitcoin). Une fois déchiffré, le code nous donne : horizon jaune",
        SOLUTION,
        { date: "2019-01-13" },
      ),
      [technique("aes", SOLUTION)],
    ),
  ],
  hints: [
    official(
      "Pour résoudre l'énigme entièrement, il faut impérativement se trouver devant la fresque.",
      ANNOUNCEMENT,
      confirmation(
        comment("edfn12g"),
        "The same rule in English, in the author's first reply under the r/Bitcoin post.",
      ),
      { date: "2019-01-06" },
    ),
    official(
      "I keep it secret but it's in Paris intra muros. And it's not very hard to find",
      comment("edgq5nu"),
      undefined,
      { date: "2019-01-07" },
    ),
    official("You can solve a part from your home", comment("edp94qu"), undefined, {
      date: "2019-01-10",
    }),
    official(
      "You can solve a part from your desk and other part you must see the wall in real life",
      comment("edu2t6g"),
      undefined,
      { date: "2019-01-11" },
    ),
    official("there's a clue on the hq pic", comment("edwblx4"), undefined, {
      date: "2019-01-12",
    }),
    community(
      "Apparently there's some words that are visible when exposed to a blacklight",
      comment("edx9qbr"),
      undefined,
      { date: "2019-01-12" },
    ),
  ],
  solvedAt: "2019-01-13 12:44:40",
  solveTime: 568953,
  transactions: [
    funding(
      "86be9365f75ba9d4cb965700518e45f8a5404fcc49b9dba13df3d9da7e2dc30f",
      "2019-01-02 12:15:39",
      0.000263,
    ),
    increase(
      "2628bfbc30fb75614fd9497db7e34aea96753779809da4205ecd518ef60120a3",
      "2019-01-06 21:46:01",
      0.25974,
    ),
    increase(
      "ae46cc481a1b227a2f822f94b52b1743a05e63726bdf38c15494ea138943243c",
      "2019-01-07 10:42:19",
      0.02492209,
    ),
    increase(
      "3e13684dd5f9dbc2191f84f773ea3db5cb7dd605f93e814a4b45b234966cac27",
      "2019-01-07 18:26:14",
      0.000999,
    ),
    increase(
      "dfe23d4ab8b0ab392ef1c1dd8a6bcbb44b1ec28f325ec8eab1d7877e8bd765cd",
      "2019-01-07 19:52:29",
      0.00007591,
    ),
    increase(
      "495cf1fb0e05d7beb3efa2e469e1674e07670d3d450499d171f63608bdfc645a",
      "2019-01-07 19:57:21",
      0.0014245,
    ),
    increase(
      "59aad921b7ab788ee583f25f978a30df583fe724cb2b68f1147338a011cfa685",
      "2019-01-09 10:34:31",
      0.00004319,
    ),
    increase(
      "8e7831d1d5afacead8df837c7d3ea896f0e069b459525b3590809e66479c1b4d",
      "2019-01-09 18:47:06",
      0.0013,
    ),
    increase(
      "e753189ceac64c5aa50609263e90ea4595a0f6c99a9bcd008d49568c568bbb60",
      "2019-01-10 21:33:17",
      0.000081,
    ),
    increase(
      "3bd441c2c33b1f592eee2bb70d450cd631f99d12bdd87691d81cda7344b07db0",
      "2019-01-12 04:14:08",
      0.00031439,
    ),
    claim(
      "e467bab977461b61b15d176fd35bdfb8bf2c39ad03fe9fe1072dddc7486b1bf5",
      "2019-01-13 12:44:40",
      0.28901098,
    ),
    increase(
      "a116251cc6e2361e22dec2489b4550ee99b115da3e3e70090a32cbd46de9f701",
      "2019-09-19 09:36:26",
      0.00001,
    ),
    sweep(
      "1820b5366eea7ffc4319261aa242bbc49fc2aa001d17d5bb1b0c68345540ae66",
      "2019-09-21 03:57:39",
      0.0000081,
    ),
    increase(
      "c473eb7e1aa75fc6103eda4f6c401d84c089ec5ccce3780112690ce777b2280b",
      "2019-12-22 11:29:21",
      0.05777912,
    ),
    sweep(
      "b6a448e3f493ee96f075df5119a81b33ec5d71fcf977f6a5e361844d0116eead",
      "2019-12-22 11:29:21",
      0.05467909,
    ),
    increase(
      "7b6a8ac2ee01a5c696adc04102da0efb8f3d097fccabf447a686c15fba5ce258",
      "2026-05-26 10:16:52",
      0.00000791,
    ),
    sweep(
      "1718788379eb5d5d26cbe91f0a79c01a87a96305fb25bc2e2a91e94d4f8aa614",
      "2026-05-26 10:16:52",
      0.0000033,
    ),
  ],
  solver: party("Antoine Ferron", {
    key: "antoine-ferron",
    kind: PartyKind.Person,
    about:
      "Found the mural's twelve words with Marina, who goes by marabrito31, in a week of night visits, a blue torch and a brute force over the last two words.",
    profiles: [profile("github", "https://github.com/antonio-fr")],
    facts: [
      fact(
        "Named by the author as one of the two people who solved the mural, with marabrito31.",
        SOLUTION,
        { date: "2019-01-13" },
      ),
      fact(
        "Wrote the whole story for bitcoin.fr: the Base64 words first, the AES key from the author by email, Caesar with the keys g and h, then four colour words by regex over the French list.",
        NARRATIVE,
        { date: "2019-01-14" },
      ),
      fact(
        "Ran out the last two colour words with a scan script he called Seekplace, which found the phrase after about an hour on January 13, then swept the funds through Electrum.",
        NARRATIVE,
        { date: "2019-01-14" },
      ),
    ],
  }),
  assets: assets({
    puzzle: "puzzle.jpg",
    sourceUrl: comment("edfn12g"),
    digests: [
      digest(
        "puzzle.jpg",
        "b84df883464cef85a69169a43435cc8446a44cc0134b06abc5296c74d9c95889",
        2340685,
        {
          url: HD_PICTURE,
          archive: `https://web.archive.org/web/20190207083730id_/${HD_PICTURE}`,
        },
      ),
    ],
  }),
});

/** Pascal Boyart's mural in Paris, one puzzle for about 0.29 BTC. */
export class LiberteGuidantLePeupleCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "liberte-guidant-le-peuple";

  /** Who painted the mural. */
  static readonly author = party("Pascal Boyart", {
    key: "pascal-boyart",
    kind: PartyKind.Person,
    aliases: ["PBoy"],
    about:
      "Paris street artist who signs as PBoy and once hid a Bitcoin wallet in a wall in the 19th arrondissement.",
    addresses: ["1KKFT9Q9BWWMFtrDnfKuaDp32CZQ9Jd7Fg"],
    profiles: [
      profile("website", "https://www.pboy-art.com/"),
      profile("reddit", "https://www.reddit.com/user/Pascalboyart/"),
      profile("twitter", "https://x.com/pascalboyart"),
    ],
    facts: [
      fact(
        "Painted the mural for the tenth birthday of the genesis block and posted it to r/Bitcoin with the address, crediting Alistair Milne for the funds.",
        THREAD,
        { date: "2019-01-07" },
      ),
      fact(
        "Asked for Bitcoin donations to 1KKFT9Q9BWWMFtrDnfKuaDp32CZQ9Jd7Fg, the address that paid for the project.",
        ANNOUNCEMENT,
        { date: "2019-01-06" },
      ),
      fact(
        "Noted on the same page that French authorities painted over the mural in February 2019, and that a set of 100 NFTs followed in September.",
        ANNOUNCEMENT,
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [liberteGuidantLePeuple];

  /** Builds the canonical collection. */
  constructor() {
    super(
      LiberteGuidantLePeupleCollection.key,
      LiberteGuidantLePeupleCollection.author,
      LiberteGuidantLePeupleCollection.puzzles,
    );
  }
}

/** Canonical collection instance. */
export const liberteGuidantLePeupleCollection = new LiberteGuidantLePeupleCollection();
