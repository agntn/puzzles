import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The block 21 thread, with the question, the funding txid, the hints and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/bu6umc/7_mbtc_quizchain2_block_21/";

/** u/silver_anth's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/bu6umc/comment/epdq8m4/";

/** Quizchain2 block 21: `21 million`, the coin limit, with `fixed money supply` in the TOMI field. */
export const quizchain2Block21 = puzzle({
  id: "quizchain2/21",
  chain: "bitcoin",
  address: "145XVhfc2hbPxtkQbB9VKyjigA5EZ9gTKq",
  sourceUrl: THREAD,
  startedAt: "2019-05-28 11:32:43",
  status: Status.Solved,
  pubkey: compressed("03029fb4e3bc3bbaffa36e95b7441c9f24051cae196b7d37c70d1cf4d89b7d67c0"),
  key: wif("L3Pg58Hf7C15Bmy8ejYsKk2AyfmJQeR5826bc3piGRVj4h4GAVXM")
    .entropy(
      "72e49243678e88024aa76afeeadfed34",
      source(THREAD, "MD5 of the number, TOMI and three words"),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: Can you solve this block without any question?", THREAD, undefined, {
      answer: answer(
        'The solution was obviously 21 million (the limit on the number of bitcoins), which reduced the task to finding the TOMI field. I chose "fixed money supply" for that.',
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("solved: 21 million TOMI fixed money supply", PLAYER_COMMENT),
    }),
    official("FIrst three digits of hash are 72e.", THREAD),
    official("Update: First digit of solution only MD5 hash is 9.", THREAD),
    official("First digit of TOMI field only MD5 hash is f.", THREAD),
    official("You know only the block number.", THREAD),
    official(
      "Might the number 21 be significant in the Bitcoin space somehow? Oh, and TOMI field is three words in lower case.",
      THREAD,
    ),
  ],
  solvedAt: "2019-05-29 23:06:39",
  solveTime: 128_036,
  transactions: [
    funding(
      "e7c7fa6c814f13602458d22ed9dec0c77a15296be304aab53aa6df3dcbfe6bee",
      "2019-05-28 11:32:43",
      0.007,
    ),
    claim(
      "7935256020dbe82e906fd3a04c8db33cc27bc2604308b8deb88d090a713db9ec",
      "2019-05-29 23:06:39",
      0.00653449,
    ),
  ],
});
