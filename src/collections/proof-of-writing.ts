import { SingletonCollection } from "../core/collection.ts";
import {
  answer,
  assets,
  digest,
  claim,
  compressed,
  decrease,
  fact,
  funding,
  increase,
  official,
  p2pkh,
  party,
  PartyKind,
  profile,
  seed,
} from "../core/parts.ts";
import { ecashPuzzle, Status } from "../core/puzzle.ts";

/** The article as republished on the new Proof Of Writing, with the address, both hints and the solved note. */
const ARTICLE =
  "https://www.proofofwriting.com/posts/building-an-awesome-ecash-community-and-a-chance-to-win-15m-xec";

/** The first version of the article, March 1, 2025, as the Wayback Machine saw it. `puzzle.txt` is its text. */
const CAPTURE =
  "https://web.archive.org/web/20250327234214/https://proofofwriting.com/building-an-awesome-ecash-community-and-a-chance-to-win-5m-xec/";

/** The author's post announcing the republished puzzle. */
const RELAUNCH = "https://x.com/caincurrency/status/2043911484040740939";

/** The solver's post announcing the claim, a reply to the relaunch. */
const SOLVED = "https://x.com/oritwoen/status/2092957918186316275";

/** The solver's follow-up with the seed and the way to it. */
const SOLUTION = "https://x.com/oritwoen/status/2093029042454671607";

/**
 * Building an awesome eCash community and a chance to win 5M XEC: an essay on what a crypto
 * community needs, and the 12 words of a Cashtab wallet sit on its diagonal. Paragraph n gives
 * its n-th word, from "Matter" to "trip".
 */
export const ecashCommunity = ecashPuzzle({
  id: "proof-of-writing",
  address: p2pkh(
    "ecash:qq5r308v2mkh6x5mkqpr6wytszz6f9r7qcnfttev0z",
    "2838bcec56ed7d1a9bb0023d388b8085a4947e06",
  ),
  sourceUrl: ARTICLE,
  startedAt: "2025-03-01 08:32:39",
  status: Status.Solved,
  pubkey: compressed("0257eaa8768dc793876213a92a510f607af70bd0adc946d1f8fdf48d31b7f48b6d"),
  key: seed(
    "matter key easily slot maple two visa swamp subject friend robust trip",
    "m/44'/1899'/0'/0/0",
  ),
  prize: 30068000.94,
  hints: [
    official("Revelations 22:13", ARTICLE, undefined, {
      answer: answer(
        'The clue "Alpha and Omega" defines paragraphs from matter to believe. From the next 12 paragraphs, I take words 1, 2, ... 12 and convert the three forms into the BIP39 dictionary. Cashtab Path1899 gives an exact match.',
        SOLUTION,
        { date: "2026-08-27" },
      ),
    }),
    official("It can be solved without ai or a computer", ARTICLE, undefined, {
      date: "2026-04-14",
    }),
  ],
  solvedAt: "2026-08-26 23:41:30",
  solveTime: 46969731,
  transactions: [
    funding(
      "933e0f483b6402e7cafccfe065d185cacfdbe6bb0e359d9ac0c421ff495d0000",
      "2025-03-01 08:32:39",
      5000000,
    ),
    decrease(
      "984c4638e2c433db79dd2bae3c8df0f2f6d90c15465dc0050c6468d102cc2816",
      "2025-09-29 05:39:43",
      5059096.41,
    ),
    increase(
      "3dfd1db9bf95ffed63143997ce2276a873e195c689462e3aa2fcf3796484c97d",
      "2025-09-29 18:55:14",
      5058997.76,
    ),
    increase(
      "d9c2c9eeb3fd981bccb69df44c23c1cbf640044a6f49e5e565f2c97148822d39",
      "2026-04-14 04:35:26",
      10000000,
    ),
    increase(
      "1c54e9b7dd7f72cd4c5f76287d5bde114fceb2905ad033250a375e3513a41763",
      "2026-06-21 01:15:44",
      10000000,
    ),
    increase(
      "e590bee4df615d735ffbd7923f0566599ac8f6ad6fbaab62827fc2bf9497353d",
      "2026-08-20 06:57:47",
      5000000,
    ),
    claim(
      "8e729528b8091f19ca5371f3a6a56e3536d18d7514a1d2abdf3f2f889d189c30",
      "2026-08-26 23:41:30",
      30067980.76,
    ),
  ],
  solver: party("Ori", {
    key: "oritwoen",
    kind: PartyKind.Person,
    aliases: ["oritwoen"],
    about:
      "Developer who read the Proof Of Writing essay on its diagonal and claimed the 30 million XEC in it.",
    profiles: [
      profile("github", "https://github.com/oritwoen"),
      profile("twitter", "https://x.com/oritwoen"),
      profile("website", "https://oritwoen.dev"),
    ],
    facts: [
      fact(
        "Announced the solve by quoting cain's relaunch post with a link to the claim transaction, and promised the solution and the key in a few days.",
        SOLVED,
        { date: "2026-08-27" },
      ),
      fact(
        "Posted the seed and the solution the same day, after seeing that cain had already released the seed.",
        SOLUTION,
        { date: "2026-08-27" },
      ),
    ],
  }),
  assets: assets({
    puzzle: "puzzle.txt",
    sourceUrl: CAPTURE,
    digests: [
      digest(
        "puzzle.txt",
        "e421d1f38196643c9c753cb9b3cffb160de499467e8861e1fa45d0818256e245",
        4783,
      ),
    ],
  }),
});

/** Building an awesome eCash community, one Proof Of Writing article by cain. */
export class ProofOfWritingCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "proof-of-writing";

  /** Who published the puzzle. */
  static readonly author = party("cain", {
    key: "cain",
    kind: PartyKind.Person,
    aliases: ["Cain's Chronicles", "caincurrency"],
    about:
      "Writer on Proof Of Writing, the eCash site that pays its writers in XEC, who hid a Cashtab seed in an essay about the eCash community and raised the prize from 5 to 30 million XEC.",
    profiles: [profile("twitter", "https://x.com/caincurrency")],
    facts: [
      fact(
        "Published the essay on the first version of Proof Of Writing on March 1, 2025, under the title with a chance to win 5M XEC.",
        CAPTURE,
        { date: "2025-03-01" },
      ),
      fact(
        "Republished it on the new site on April 14, 2026, because nobody had solved it, raised the prize to 25M XEC and added the hint that it can be solved without AI or a computer.",
        ARTICLE,
        { date: "2026-04-14" },
      ),
      fact("Announced the relaunch on X with over 15M XEC up for grabs.", RELAUNCH, {
        date: "2026-04-14",
      }),
      fact(
        "Marked the article solved, linked the solver's post and put the solution behind the paywall, with the seed words bolded and capitalized.",
        ARTICLE,
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [ecashCommunity];

  /** Builds the canonical collection. */
  constructor() {
    super(
      ProofOfWritingCollection.key,
      ProofOfWritingCollection.author,
      ProofOfWritingCollection.puzzles,
    );
  }
}

/** Canonical collection instance. */
export const proofOfWriting = new ProofOfWritingCollection();
