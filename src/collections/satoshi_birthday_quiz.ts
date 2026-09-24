import { SingletonCollection } from "../core/collection.ts";
import {
  answer,
  claim,
  compressed,
  confirmation,
  fact,
  funding,
  official,
  p2pkh,
  party,
  PartyKind,
  profile,
  seed,
  source,
} from "../core/parts.ts";
import { bitcoinPuzzle, Status } from "../core/puzzle.ts";

/** Where every question, hint and answer of this puzzle was published. */
const THREAD = "https://www.reddit.com/r/Bitcoin/comments/b9peum/satoshi_birthday_7_million_quiz/";

/** The one Wayback capture whose HTML still carries the post and every comment. */
const CAPTURE =
  "https://web.archive.org/web/20230611180546/https://old.reddit.com/r/Bitcoin/comments/b9peum/satoshi_birthday_7_million_quiz/";

/**
 * Satoshi birthday 7 million quiz: seven multiple-choice questions about Bitcoin history, the
 * correct answer sentences joined by single spaces, and the SHA-256 of that text used as BIP39
 * entropy. The first address of the resulting wallet held the prize for five hours.
 */
export const satoshiBirthdayQuizPuzzle = bitcoinPuzzle({
  id: "satoshi_birthday_quiz",
  address: p2pkh("1GNrvamE9WP4DL6hTicWy1aoqCUwFM2Jbz", "a8ac4bd83f5946f7e7b2452c1a9f28eba2bd13d2"),
  sourceUrl: THREAD,
  startedAt: "2019-04-05 09:45:02",
  status: Status.Solved,
  pubkey: compressed("02a3fdb91b1ad15a52e41be79bab912ac993d573ac015a7d27fc01ba61a9ff53fd"),
  key: seed(
    "another blush custom lucky brisk sugar estate dinosaur walnut grab drill toddler street series retreat smile barrel cart grunt frequent helmet lake engine solve",
    "m/44'/0'/0'/0/0",
  ).entropy(
    "098310da4251c5b19359f3f6cca90bf1bd6f882e066512c4619cae56aef9529e",
    source(THREAD, "SHA-256 of the seven answer sentences, joined by single spaces"),
  ),
  prize: 0.07,
  hints: [
    official(
      "To find the seed, answer the following 7 quiz questions (multiple choice). The SHA 256 hash of all correct answers combined is the wallet seed. Insert one space between answers.",
      THREAD,
      confirmation(CAPTURE, "Wayback capture of the thread, post and comments"),
      {
        answer: answer("1 c) 2 a) 3 d) 4 a) 5 b) 6 d) and 7 a)", THREAD),
      },
    ),
    official(
      'For example, if you chose d) at question 1 and c) at question 2, you would enter "There were were only two posts about price on the Bitcoin subreddit. Franklin D. Roosevelt required all American citizens by executive order 6102 to deliver all of their gold at the fixed price of $20.67 before May 1st." (leaving out the leading d) and c)).',
      THREAD,
    ),
    official(
      "There is only one seed. Use the seven sentences, seperated by one space and generate one hash and one only from that.",
      THREAD,
    ),
    official("Legacy Bitcoin address starting with 1,", THREAD),
    official(
      "Thanks to Ian Coleman for the tool at iancoleman.io/bip39/, which I used to derive the brain wallet from the hash of the correct answer.",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-05 14:52:36",
  solveTime: 18454,
  transactions: [
    funding(
      "25816457b40bf92fff53c39d5b4e2916f5fb6d471fe1afda1c2ed7da28607949",
      "2019-04-05 09:45:02",
      0.07,
    ),
    claim(
      "f8fa32a473e2ef6da1f3a77366033512159df2db045eb0ba27c7acfe70466bd0",
      "2019-04-05 14:52:36",
      0.0696808,
    ),
  ],
});

/** Satoshi birthday 7 million quiz, one puzzle by AoiNakamoto. */
export class SatoshiBirthdayQuizCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "satoshi_birthday_quiz";

  /** Who published the puzzle. */
  static readonly author = party("AoiNakamoto", {
    key: "aoi-nakamoto",
    kind: PartyKind.Person,
    about:
      "Pseudonymous author of the 2019 Quizchain puzzle series on Reddit, who shut it all down in August 2019 and called it a failed experiment.",
    profiles: [profile("reddit", "https://www.reddit.com/user/AoiNakamoto/")],
    facts: [
      fact(
        "Asked r/Bitcoin on 2019-04-05 whether a quiz giveaway would be welcome, hours before posting the birthday quiz.",
        "https://www.reddit.com/r/Bitcoin/comments/b9l37o/",
        { date: "2019-04-05" },
      ),
      fact(
        "Ran the Quizchain blocks on r/bitcoinpuzzles and r/Grycoin from April to August 2019, a few mBTC each for a text puzzle hashed into a wallet.",
        "https://www.reddit.com/r/Grycoin/comments/c012gd/",
        { date: "2019-06-13" },
      ),
      fact(
        "Announced the shutdown on 2019-08-04 as time to reflect on the whole failed experiment.",
        "https://www.reddit.com/r/Grycoin/comments/clpqlv/",
        { date: "2019-08-04" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [satoshiBirthdayQuizPuzzle];

  /** Builds the canonical collection. */
  constructor() {
    super(
      SatoshiBirthdayQuizCollection.key,
      SatoshiBirthdayQuizCollection.author,
      SatoshiBirthdayQuizCollection.puzzles,
    );
  }
}

/** Canonical collection instance. */
export const satoshiBirthdayQuiz = new SatoshiBirthdayQuizCollection();
