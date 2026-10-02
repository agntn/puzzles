import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The block 26 thread, with the question, the funding txid, the hints and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/bvqrlr/7_mbtc_quizchain2_block_26/";

/** Quizchain2 block 26: Samson's riddle, shortened to `sweet honey strong lion`. */
export const quizchain2Block26 = puzzle({
  id: "quizchain2/26",
  chain: "bitcoin",
  address: "1MZkYJGdwQyBxVjeP6yFEfeofniPe3DuZA",
  sourceUrl: THREAD,
  startedAt: "2019-06-01 13:46:42",
  status: Status.Solved,
  pubkey: compressed("02eba353713570f31b7077c98aa0053c480c20e282e5dde07765e5d3909568a214"),
  key: wif("L1f62oEUFZwThriUzuAFQL8kVaY9wm85zrun6Y185qpUfCiB5DVk")
    .entropy(
      "7b80eaaa48d1aec2289c956ae3978deb",
      source(THREAD, "MD5 of the four words, TOMI and the given field"),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: Magical Crypto Friends", THREAD, undefined, {
      answer: answer(
        'As noted by several players in comments, this was about the famous Samson riddle in the Bible. The answer to that in the BIble was "What is sweeter than honey? What is stronger than a lion?". I simplified this a bit to "sweet honey strong lion".',
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI Extremely unfair riddle", THREAD),
    official("First three digits of MD5 hash are 7b8.", THREAD),
    official("Not Pan or Pon", THREAD),
    official("Not the Panda", THREAD),
    official("Not the Pony", THREAD),
    official("Not the Chikun either.", THREAD),
    official("Looking for an extremely unfair riddle.", THREAD),
  ],
  solvedAt: "2019-06-03 11:36:20",
  solveTime: 164_978,
  transactions: [
    funding(
      "05ed3d948218538a9f4d55a79c12b22900912862dd83d428d4268a6392eb8f24",
      "2019-06-01 13:46:42",
      0.007,
    ),
    claim(
      "e31653ee198402c2983abcae23b4c559e3449a44cbb1a865c821ecb912242830",
      "2019-06-03 11:36:20",
      0.006618,
    ),
  ],
});
