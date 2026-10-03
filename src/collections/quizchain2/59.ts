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

/** The block 59 thread, with the question, the funding txid, the mistyped hash digits, two hints and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c98uls/7_mbtc_quizchain2_block_59/";

/** u/JDScreesh's comment with the whole MD5 hash, after the claim. */
const HASH_COMMENT = "https://www.reddit.com/r/Grycoin/comments/c98uls/comment/et4qkxz/";

/** Quizchain2 block 59: `ET`, read off an Atbash foldover, posted with the wrong third hash digit. */
export const quizchain2Block59 = puzzle({
  id: "quizchain2/59",
  chain: "bitcoin",
  address: "1JtmV83kdAXhBAqEWCRQAsJ7gU9jzPfYnV",
  sourceUrl: THREAD,
  startedAt: "2019-07-04 12:35:54",
  status: Status.Solved,
  pubkey: compressed("0360420865b60d7120887dee106e204b3f7a5cc12ef5e6e0451e466abd7d7126ee"),
  key: wif("Kxwr6iJGfiBvm11qLdqKUv9wz1BRJ2MZJRsjJH4HahURfvxF6A4d")
    .entropy(
      "9be70160646f1c10dbec577ebf20f715",
      source(HASH_COMMENT, "MD5 of the two letters, TOMI and six words"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD), technique("atbash", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Famous film.", THREAD, undefined, {
      answer: answer(
        "Solution was ET and TOMI field was Atbash foldover two to the right, exactly the same TOMI field as the last time I used this method.",
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD),
    official("FIrst three digits of MD5 hash are 9b3.", THREAD),
    official(
      "Would be really difficult without context, but it uses a method used previously.",
      THREAD,
    ),
    official("Hint 1: I use it quite a lot here.", THREAD),
    official("Hint 2: FIrst two words of TOMI field are Atbash foldover.", THREAD),
  ],
  solvedAt: "2019-07-06 23:18:08",
  solveTime: 211_334,
  transactions: [
    funding(
      "1d398d21b1a599f728ad5c7652194b3de794c545401b11ac32be22987afd3a88",
      "2019-07-04 12:35:54",
      0.007,
    ),
    claim(
      "02a841504bfae131472f79a0c7662f44ec329402de07585e14f3c24fa823867d",
      "2019-07-06 23:18:08",
      0.00682048,
    ),
  ],
});
