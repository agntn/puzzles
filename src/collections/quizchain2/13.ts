import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The block 13 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/brogvu/7_mbtc_quizchain2_block_13/";

/** u/mooncritic's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/brogvu/comment/eofcjjh/";

/** Quizchain2 block 13: `Pizza`, Atbash of `Kraaz`, then TOMI and Laszlo Hanyecz's name. */
export const quizchain2Block13 = puzzle({
  id: "quizchain2/13",
  chain: "bitcoin",
  address: "1KZ2riUcEkAebmPrGYhSJwC4f9EZohZWkW",
  sourceUrl: THREAD,
  startedAt: "2019-05-21 07:11:03",
  status: Status.Solved,
  pubkey: compressed("0344193ee4b704045e85c197bab2862e12db7fe792a7a9f2dcf594de7df4325b78"),
  key: wif("L2AH6wtNHQjdRftfuHd5VKXiGh3RB4HNm2tiBF8i9MKKzxLuYJTU")
    .entropy("b5e4cbfe80a8b7a927101b882ed00c91", source(THREAD, "MD5 of the word, TOMI and a name"))
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: Kraaz", THREAD, undefined, {
      answer: answer(
        "Method was using Atbash on the solution Pizza (for Bitcoin Pizza day today). The most difficult part was getting the spelling of the name Laszlo Hanyecz right, which went into the TOMI field.",
        THREAD,
      ),
    }),
    official("Format: [Solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer(
        'Solution as mentioned in other comments is "Pizza TOMI Laszlo Hanyecz".',
        PLAYER_COMMENT,
      ),
    }),
    official("Tomi field is the relevant name for the solution.", THREAD),
    official("First three digits of MD5 hash are b5e.", THREAD),
    official("First digit of solution only is c.", THREAD),
    official("First digit of TOMI field only is f.", THREAD),
  ],
  solvedAt: "2019-05-22 13:06:33",
  solveTime: 107_730,
  transactions: [
    funding(
      "7984db3918bf18688403e3b7f5d2bd133023a2ba38ea5442e310df80a0a708e5",
      "2019-05-21 07:11:03",
      0.007,
    ),
    claim(
      "eea395e5b3f3e48e836dc7cf19c1c91341a51f0ce5d8c0b433256c6991d75f73",
      "2019-05-22 13:06:33",
      0.0063616,
    ),
  ],
});
