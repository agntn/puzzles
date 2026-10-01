import {
  answer,
  claim,
  compressed,
  funding,
  official,
  p2pkh,
  source,
  wif,
} from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

/** The block 12 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/br2rys/7_mbtc_quizchain2_block_12/";

/** The author's reply of May 20, 2019 about capitalization. */
const CAPITALIZATION = "https://www.reddit.com/r/bitcoinpuzzles/comments/br2rys/comment/eo9mu37/";

/** The author's reply of May 20, 2019 about the bracketed words. */
const MEANING = "https://www.reddit.com/r/bitcoinpuzzles/comments/br2rys/comment/eo9mw5p/";

/** The author's reply of May 21, 2019 about how common the word is. */
const COMMONNESS = "https://www.reddit.com/r/bitcoinpuzzles/comments/br2rys/comment/eo9wogo/";

/** The author's reply of May 21, 2019 about the last TOMI word. */
const ANAGRAM = "https://www.reddit.com/r/bitcoinpuzzles/comments/br2rys/comment/eo9wl5a/";

/** The author's reply of May 21, 2019 about which words form the anagram. */
const DIRECTION = "https://www.reddit.com/r/bitcoinpuzzles/comments/br2rys/comment/eoaab0d/";

/** The author's reply of May 21, 2019 about the word ring. */
const RING = "https://www.reddit.com/r/bitcoinpuzzles/comments/br2rys/comment/eoafnl3/";

/** u/Crypto_Rachel's comment with the winning string, the address and the key. */
const PLAYER_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/br2rys/comment/eoasr0u/";

/** Quizchain2 block 12: `grycoin TOMI coy ring anagram`, after a wrong capitalization hint. */
export const quizchain2Block12 = bitcoinPuzzle({
  id: "quizchain2/12",
  address: p2pkh("187Q5XNNezeyBYgwY8gL2swXUWtWvwyqZ6", "4dfea40b2e155b0c5aa593110305897070e73d55"),
  sourceUrl: THREAD,
  startedAt: "2019-05-20 12:28:07",
  status: Status.Solved,
  pubkey: compressed("0342c1f5fffae5de54bd0e823cff65f7b193851f4428e685e43355d5f9c57ef559"),
  key: wif("KzWPBGPJsFFDXGRawczb5XqsMauPTXzpJ5YrXkTRNfwchSpkmrXT").entropy(
    "b08d3726d3fdd5804cd40ea395be2658",
    source(THREAD, "MD5 of the corrected word, TOMI and three words"),
  ),
  prize: 0.007,
  hints: [
    official(
      "The question uses four words, with three of them in brackets. That means those three are supposed to be replaced by one word and then the resulting two words are supposed to be transformed into a one word solution.",
      THREAD,
    ),
    official("Question: (intentionally keeping secret) ring", THREAD, undefined, {
      answer: answer(
        'Solution: The three words in brackets are one of the meanings for the word "coy" I found online. I thought that was a nice match for a puzzle. The words "coy ring" resolve as an anagram to Grycoin. So solution was Grycoin, TOMI field was coy ring anagram.',
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("grycoin TOMI coy ring anagram", PLAYER_COMMENT),
    }),
    official("TOMI field is three words, the last one of them is anagram.", THREAD),
    official("First three digits of MD5 hash are b08.", THREAD),
    official("First digit of solution only MD5 hash is 0.", THREAD),
    official("First digit of TOMI field only MD5 hash is 3.", THREAD),
    official(
      "All three words in TOMI field are all lower case, no upper case letter in TOMI field. One word solution has first letter only in upper case, like this example: Upper.",
      CAPITALIZATION,
      undefined,
      {
        answer: answer(
          "As noted in comments, solution was grycoin, not Grycoin. First mistake of this round.",
          THREAD,
        ),
      },
    ),
    official("It is one of the meanings of the word.", MEANING),
    official("Neither very common nor very unusual.", COMMONNESS),
    official('The last TOMI word is not "an anagram" it is "anagram".', ANAGRAM),
    official("Solution word is anagram of the other two TOMI words combined...", DIRECTION),
    official("It is the second of three words in the TOMI field.", RING),
  ],
  solvedAt: "2019-05-21 06:46:58",
  solveTime: 65_931,
  transactions: [
    funding(
      "b7939af53e5a465d8e12efef65ba13f9d96bbab87045c83fa11fda34b16545e4",
      "2019-05-20 12:28:07",
      0.007,
    ),
    claim(
      "15ec49c6b949804e0bd8f3f738a438627c74e978ee88a4cf81a3e1aa7420160a",
      "2019-05-21 06:46:58",
      0.00655072,
    ),
  ],
});
