import {
  answer,
  claim,
  compressed,
  funding,
  official,
  source,
  technique,
  wif,
} from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The block 43 thread, with the question, the funding txid, the hash digits, the hint and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c297as/7_mbtc_quizchain2_block_43/";

/** u/Arpox's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/c297as/comment/erikvui/";

/** Quizchain2 block 43: `rather between`, the fourth and third words of the block 42 mnemonic, with `block 42 mnemonic` in the TOMI field. */
export const quizchain2Block43 = puzzle({
  id: "quizchain2/43",
  chain: "bitcoin",
  address: "169KvQtcBKheFbTooCqo1tHBGr23ZZvyZ5",
  sourceUrl: THREAD,
  startedAt: "2019-06-18 22:37:21",
  status: Status.Solved,
  pubkey: compressed("02757deb5f3a1a128e42696b030a0a660d394b009f6327fd1f23b4bc8e8f33a8fc"),
  key: wif("Kxzj9HFrK6jb9e4wLGBUMiSxwG5WB82QiKqygA8rxusE2sj7VGnC")
    .entropy(
      "e465846b8dc5e4789b972356fe8ef7e1",
      source(THREAD, "MD5 of the two words, TOMI and three words"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Two words.", THREAD, undefined, {
      answer: answer(
        'That results in "rather between" as the solution and "block 42 mnemonic" as the TOMI field.',
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("Solution : rather between TOMI block 42 mnemonic", PLAYER_COMMENT),
    }),
    official("Solution format is [word1] [word2] with both in all lower case.", THREAD),
    official("TOMI field is three items.", THREAD),
    official("First three digits of MD5 hash are e46.", THREAD),
    official("First digit of solution only MD5 hash is a.", THREAD),
    official("First two digits of TOMI field only MD5 hash are 0c.", THREAD),
    official(
      "Hint 1: My first idea was to use block 43 of the first run, but I rejected that one.",
      THREAD,
    ),
  ],
  solvedAt: "2019-06-18 23:21:34",
  solveTime: 2_653,
  transactions: [
    funding(
      "6a79d13f7bc76af157493217f7e516ed5bb95bf4020df05bc92852a67d1325b7",
      "2019-06-18 22:37:21",
      0.007,
    ),
    claim(
      "5e1f08c971fbcd22932e31741db2f59929ca85e96cb732481981d99b5f0cc903",
      "2019-06-18 23:21:34",
      0.0069322,
    ),
  ],
});
