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

/** The block 37 thread, with the question, the funding txid, the six hints and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c012gd/10_mbtc_quizchain2_block_37/";

/** u/Randomiser's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/c012gd/comment/eqzljo9/";

/** Quizchain2 block 37: `Quizchain player`, the meaning of the made up word Minmin, with `Mine with your mind` in the TOMI field. */
export const quizchain2Block37 = puzzle({
  id: "quizchain2/37",
  chain: "bitcoin",
  address: "131KikgawApZakrm5e8RPobDjKBoMvMFei",
  sourceUrl: THREAD,
  startedAt: "2019-06-12 23:48:42",
  status: Status.Solved,
  pubkey: compressed("038bdc1d347f7bcb1ba23ebe488b5874274c8ca2f783504dd5dfa40a5683d4ea22"),
  key: wif("Kx5xWpgz2G6gVjuwLJrqxajRRkj6TqfMyCPDEn9FoRa7o5LdkmyM")
    .entropy(
      "394596b95fd8e24ea742969f138c665e",
      source(THREAD, "MD5 of the two words, TOMI and four words"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.01,
  hints: [
    official("Question: I created a new word. Minmin. What does it mean?", THREAD, undefined, {
      answer: answer(
        'Solution was "Quizchain player" and TOMI field was "Mine with your mind".',
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("Quizchain player TOMI Mine with your mind", PLAYER_COMMENT),
    }),
    official(
      'Solution format is two words, with the first one starting with a capital letter, like this: "Word1 word2".',
      THREAD,
    ),
    official(
      'TOMI format is four words. Each has four letters. The first and last word differ by only one letter. Only the first word starts with a capital letter, like this: "Word1 word2 word3 word4". No words of dubious moral standing in this TOMI field.',
      THREAD,
    ),
    official("First three digits of MD5 hash are 394.", THREAD),
    official("First digit of solution only MD5 hash is d.", THREAD),
    official("First two digits of TOMI field only MD5 hash are 49.", THREAD),
    official("First word in TOMI field is a homonym related to Bitcoin.", THREAD),
    official("Hint 2: How do you mine the quizchain?", THREAD),
    official(
      'Hint 3: The first word of the TOMI field is "Mine". It is a homonym, since it has the meaning to mine a chain or gold as well as "this is mine".',
      THREAD,
    ),
    official("Hint 4: You all", THREAD),
    official(
      'Hint 5: Tomi field may be used as a slogan for the quizchain, just as "Satoshi without the consonants" is a catchphrase for my handle name.',
      THREAD,
    ),
    official(
      'Hint 6 (last one, after that you are on your own until further notice): First word of solution is "Quizchain"',
      THREAD,
    ),
  ],
  solvedAt: "2019-06-13 04:57:56",
  solveTime: 18_554,
  transactions: [
    funding(
      "4e63d912321e10883730adcb1af660bca1a1dd0efe77bfedc2f0e6830ab82702",
      "2019-06-12 23:48:42",
      0.01,
    ),
    claim(
      "a0f67c8e7c6c889f4278cb4e0e68173321ff16ec90f0801c40e2b2d870f710b8",
      "2019-06-13 04:57:56",
      0.00974867,
    ),
  ],
});
