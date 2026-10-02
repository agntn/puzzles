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

/** The block 32 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/by5p2x/7_mbtc_quizchain2_block_32/";

/** u/silver_anth's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/by5p2x/comment/eqczsmi/";

/** Quizchain2 block 32: `Omnipotent`, the word the first run's block 22 should have used, with that block in the TOMI field. */
export const quizchain2Block32 = puzzle({
  id: "quizchain2/32",
  chain: "bitcoin",
  address: "1HxabEFLMtAsg81dPhwfLxhqn3TZwJnka1",
  sourceUrl: THREAD,
  startedAt: "2019-06-08 04:23:49",
  status: Status.Solved,
  pubkey: compressed("03c5ea852aaa9fc70a11fef06da05c3b6be9485181f1e2b92a985fffa48e38ef85"),
  key: wif("L38e5RZ8EmQLonFbTiDf8y5kWhCxbR2PKYx76N3vbzjS5jaexBgn")
    .entropy(
      "fcd938a80d54ddf2b14dc58754677757",
      source(THREAD, "MD5 of the word, TOMI, a word and a number"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official(
      'The Yang campaign lists 104 specific policy proposals as of today. Number 103 (if my count is correct) is titled "Regulate AI and Other Emerging Technologies". It says there should be a new "Department of Technology" based in Silicon Valley, initially focused on Artificial Intelligence.',
      THREAD,
    ),
    official(
      "Question: What word comes to mind when discussing Artificial Intelligence?",
      THREAD,
      undefined,
      {
        answer: answer(
          'As noted in comments by the winner, the solution to this was "Omnipotent" and the TOMI field was "block 22".',
          THREAD,
        ),
      },
    ),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("Solution: Omnipotent TOMI block 22", PLAYER_COMMENT),
    }),
    official('The solution word starts with a capital letter, like "Solution".', THREAD),
    official("First three digits of MD5 hash are fcd.", THREAD),
    official("FIrst digit of solution only MD5 hash is b.", THREAD),
    official("FIrst digit of TOMI field only MD5 hash is 5.", THREAD),
  ],
  solvedAt: "2019-06-08 08:12:11",
  solveTime: 13_702,
  transactions: [
    funding(
      "03438972a966a2e89cf8f8a9e3ad5188ce0376d51e068289993939fbca3bda96",
      "2019-06-08 04:23:49",
      0.007,
    ),
    claim(
      "73cbd330d3c29b78befe2b267da74f70b0668baaccd63327b4b73d7eea17635b",
      "2019-06-08 08:12:11",
      0.00698656,
    ),
  ],
});
