import { SingletonCollection } from "../core/collection.ts";
import {
  answer,
  claim,
  confirmation,
  fact,
  funding,
  type Hint,
  hex,
  official,
  p2pkh,
  party,
  PartyKind,
  profile,
  uncompressed,
} from "../core/parts.ts";
import { bitcoinPuzzle, Status } from "../core/puzzle.ts";

/** Where the rules, the twelve clues and, in the comments, every answer were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/7asy51/brainwallet_puzzle_004_btc_reward/";

/** The Wayback capture whose HTML still carries the edited post and all 66 comments it shows. */
const CAPTURE = confirmation(
  "https://web.archive.org/web/20230610055046/https://old.reddit.com/r/bitcoinpuzzles/comments/7asy51/brainwallet_puzzle_004_btc_reward/",
  "Wayback capture of the thread, post and comments",
);

/** The author's announcement two weeks before the launch. */
const ANNOUNCEMENT =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/77g5h7/meta_new_puzzle_in_development_005_btc_eta_is/";

/**
 * A comment in the thread, by its Reddit id.
 *
 * @param {string} id - The comment id, without the `t1_` prefix.
 * @returns {string} The comment's permalink.
 */
function comment(id: string): string {
  return `${THREAD}${id}/`;
}

/** Quantris's walkthrough: every answer, most with the steps that lead to it. */
const WALKTHROUGH = comment("dpd2gj4");

/**
 * A clue from the post, with the answer the winner published for it.
 *
 * @param {string} text - The clue as the post prints it, on one line.
 * @param {string} solution - The winner's spoiler text for it, on one line.
 * @returns {Hint} The clue as an official hint.
 */
function clue(text: string, solution: string): Hint {
  return official(text, THREAD, CAPTURE, {
    answer: answer(solution, WALKTHROUGH, { date: "2017-11-05" }),
  });
}

/**
 * Twelve trivia riddles: answers 1 to 10 form the passphrase and 11 and 12 the salt of the
 * brainwallet.io generic tab, which runs scrypt and hashes the hex result into an uncompressed key.
 * The winner swept the address six hours after the post and published every answer.
 */
export const triviaBrainwalletRiddles = bitcoinPuzzle({
  id: "trivia-brainwallet",
  address: p2pkh("1E3NARnUX25UgMvZd5EZTutD9yVHTVGDNC", "8f0c21f95e718fbea2a5dfd417fa1338633d03ac"),
  sourceUrl: THREAD,
  startedAt: "2017-11-04 20:05:55",
  preGenesis: true,
  status: Status.Solved,
  pubkey: uncompressed(
    "04e5a18d9449ea5ee3be007dfa5fc7d8702103e814f35e661c1d06bcd644ec36a6b84869b75c0690abc9f6379d8991910d53462350b37271818c17c7b92bdf16fc",
  ),
  key: hex("eccf44b2a700e0149d67331f803ca4f68ba5793df7a4fbb75c3f7d0752faffd9")
    .wif("5KcaZnDWjq8r8SjBPPefvGdYicv4aiQ1E7FR4SMa8CVZn6SSfEi")
    .passphrase(
      "furniture mozambique 611 electromagnetic eve 119658 220285 5203242011492 wikileaks 1125241144181121721192091451125241144518120209321191141192011992511121914112611251",
    )
    .salt("mcdonnell 20")
    .derived(),
  prize: 0.04,
  hints: [
    official(
      "The below puzzles will yield a single American English word or a single number as their solution. Take the answer to each puzzle (besides the last two) and put them IN ORDER into brainwallet.io with a single space between each answer (and no space at the end of the last clue).",
      THREAD,
      CAPTURE,
    ),
    official(
      "BrainWallet is case sensitive. So only lowercase letters will be used. There will be no uppercase letters used. No punctuation is used, even in numbers. No answers will have spaces within that answer.",
      THREAD,
      CAPTURE,
    ),
    official(
      "Take the final two answers for the last 2 puzzles (puzzles 11 and 12) and use them as “salt” in the “generic” tab of brainwallet. Make sure that those final two answers are separated by one space and that there is no space after the second answer. Hit “generate”.",
      THREAD,
      CAPTURE,
    ),
    clue(
      "1) 33 37 2e 37 34 39 33 35 34 20 2d 31 32 32 2e 33 38 39 39 35 36 20 77 68 61 74 20 61 72 65 20 74 68 65 79 20 73 65 6c 6c 69 6e 67 20 28 68 6f 6f 73 69 65 72 20 73 74 72 65 65 74 29",
      "numbers are hex for ASCII, giving you lat/long coordinates for a store that sells: furniture",
    ),
    clue(
      "2) sopranos.reframed.snubbed - what country? Find the right tool (could be helpful to consider what is being input and what the desired output is).",
      "it's a what3words address for a location in: Mozambique",
    ),
    clue(
      "3) 1/2 Beyonce's [approx. 2pi - 0.28]th studio album, 1/2 law and order actor/actress, [the first night playing at USSR closed (on opposite day)] - what else happened? sum the four numerical freeways.",
      "step 1: 1/2 lemonade 1/2 ice tea is an Arnold Palmer; step 2: opposites -> the last day playing at US open; step 3: Arnold Palmer's last US open round was June 17 1994, same day as the famous O.J. Simpson car chase; answer: Freeways involved in the chase were 5, 91, 110, and 405; the sum is: 611",
    ),
    clue(
      "4) Of the four inter-galactic governors, on the order of 246, the answer to this puzzle is married to the weak one. (use the adjective form)",
      "this refers to fundamental forces, and at 246 GeV the weak and electromagnetic forces merge into electroweak. The answer is: electromagnetic",
    ),
    clue(
      "5) The same both forwards and backwards, this character is the O.G. when it comes to behaving badly.",
      "The clue indicates a palindromic name; the original sinner: Eve",
    ),
    clue(
      "6) Most elderly player to hit a ball out of the park with the bases loaded (MLB) --> what is their home country? --> Take total square miles of said country (per Wikipedia) --> identify the prime factorization of that number --> sum those factors --> multiply that result by the year I was born to get your final answer.",
      "step 1: Julio Franco -> Dominican Republic -> 18,655 sq. mi -> 5, 7, 13, 41; step 2: Kierkegaard (see OP's username) was born in 1813; answer: (5 + 7 + 13 + 41) * 1813 = 119658",
    ),
    clue(
      "7) Upon this day (of the launch of the puzzle) after subtracting 138 from the largest unit of time generally used, a really cool thing happened. Take the identifying, official number from that event, and subtract from it the telephone area code of the place where the other thing ($) that happened that day happened.",
      "step 1: 138 years ago today, patent US221222 is issued to Elkins for something cool: a fridge; step 2: Same day, patent on cash register issued to Ritty from Drayton, Ohio: area code 937; answer: 221222 - 937 = 220285",
    ),
    clue(
      "8) Relativity. Princeton. He had a teacher. Teacher died in 1909. Teacher had a thing named after him. Go to the very bottom of the Wikipedia page for that particular thing. Not the very bottom but close to it. There is a number down there. 8 digits, including one dash. Remove the smallest digit. Remove the dash. 74616b65796f75726173736f6e6f766572746f77696b6964617461. The answer is the coordinate data from the resulting entry without any punctuation (use only the digits. In order.)",
      "step 1: Talking about Einstein. Teacher that died in 1909 is Minkowski; step 2: At bottom of wikipedia for Minkowski space, we see GND: 4293944-6; follow the instructions to get 4939446; step 3: decode the hex-ASCII, which sends you to wikidata; answer: look up 4939446 in wikidata; take only digits from the attached coordinates to get: 5203242011492",
    ),
    clue(
      "9) The place that darkness fears the most, Causing orgs to hold their secrets close, Supported by crypto, Founder must tiptoe, As he collects more things to post.",
      "a poem about: Wikileaks",
    ),
    clue(
      "10) Seven individuals, Alaina, Azalea, Alexandra, Augustine, Atticus, Anastasiya, and Alexander, all stand in a straight line, all facing the same direction. Atticus and Azalea have exactly two people between them. Azalea and Alaina are not at the front of the line. Atticus is further ahead in the line than Anastasiya. Alexander has one person in between he and Anastasiya. Augustine is one spot away from either the front or the back of the line. Azalea is directly next to Alaina. Atticus is directly in the middle of the line. Identify the order of the individuals from the front of the line to the back, then take the names of the people in order and convert every letter to their corresponding numerical value in the alphabet (A=1, B=2…Z=26). The answer to this puzzle is all of the numerical values without any spaces between them in the order of their places in line. (AKA, the answer will be a loooonng continuous string of numbers.)",
      "step 1: logic out that the order of people has to be Alexandra, Augustine, Alexander, Atticus, Anastasiya, Alaina, Azalea; answer: follow instructions to get: 1125241144181121721192091451125241144518120209321191141192011992511121914112611251",
    ),
    clue(
      "11) 1834: a1 a2 a3 b1 b3 b7 c2 c3 d6 f8 h6 --> Name the non-Frenchman.",
      "the coordinates are where pieces were located at the end of a famous chess match in 1834, between the frenchman De la Bourdonnais and the non-frenchman: McDonnell",
    ),
    clue(
      "12) Purchase 2 dripping, succulent, sopping pieces of land meat for this number of U.S. dollars.",
      "A reference to @buy_2_hams, where the price is: 20",
    ),
    official(
      "There is a twitter account called 2 hams for $20. Check it out.",
      comment("dpd0vk2"),
      undefined,
      { date: "2017-11-05" },
    ),
  ],
  solvedAt: "2017-11-05 02:05:31",
  solveTime: 21_576,
  transactions: [
    funding(
      "75c4a9ed1b562dafd61cde270faa35fb49744ea3e5e2f1973a3776760af05755",
      "2017-11-04 20:04:21",
      0.04,
    ),
    claim(
      "c8d236ad1fd9e3e1f5a3907aabe263fe9c134763fa2af015886eb93c64fe3d5d",
      "2017-11-05 02:05:31",
      0.03987,
    ),
  ],
  solver: party("Quantris", {
    key: "quantris",
    about:
      "Reddit user who swept the 2017 trivia brainwallet and then posted every answer in the thread.",
    facts: [
      fact(
        "Announced the claim six hours after the launch and said half of the prize went to charity.",
        comment("dpd0742"),
        { date: "2017-11-05" },
      ),
      fact(
        "Said they got clue 12 by trying even numbers on brainwallet.io and sent part of the reward to WikiLeaks' donation address.",
        comment("dpd0r7z"),
        { date: "2017-11-05" },
      ),
      fact(
        "Published all twelve answers with the steps behind them, and the author thanked them for the walkthrough.",
        WALKTHROUGH,
        { date: "2017-11-05" },
      ),
    ],
  }),
});

/** The 2017 trivia brainwallet on r/bitcoinpuzzles, one puzzle by Kierkegaard_Soren. */
export class TriviaBrainwalletCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "trivia-brainwallet";

  /** Who published the puzzle. */
  static readonly author = party("Kierkegaard_Soren", {
    key: "kierkegaard-soren",
    kind: PartyKind.Person,
    about:
      "Reddit user who tried to revive r/bitcoinpuzzles in 2017 with one funded trivia brainwallet.",
    addresses: ["18no9TMRswUaHbi4ecBPjrPEa2KAckaCmH"],
    profiles: [profile("reddit", "https://www.reddit.com/user/Kierkegaard_Soren/")],
    facts: [
      fact(
        "Announced a Bitcoin scavenger hunt of about 0.05 BTC, meant to revive the subreddit and bring in players from outside crypto.",
        ANNOUNCEMENT,
        { date: "2017-10-19" },
      ),
      fact(
        "Launched the puzzle at 0.04 BTC instead of the planned 0.05, because the Bitcoin price had gone up.",
        THREAD,
        { date: "2017-11-04" },
      ),
      fact(
        "Asked for donations to future puzzles at 18no9TMRswUaHbi4ecBPjrPEa2KAckaCmH in an edit after the claim.",
        THREAD,
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [triviaBrainwalletRiddles];

  /** Builds the canonical collection. */
  constructor() {
    super(
      TriviaBrainwalletCollection.key,
      TriviaBrainwalletCollection.author,
      TriviaBrainwalletCollection.puzzles,
    );
  }
}

/** Canonical collection instance. */
export const triviaBrainwallet = new TriviaBrainwalletCollection();
