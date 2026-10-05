import {
  answer,
  claim,
  compressed,
  funding,
  increase,
  official,
  source,
  technique,
  wif,
} from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The block 71 thread, with the question, both funding txids, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/ce4ixs/8_mbtc_quizchain2_block_71/";

/** u/LiaVl's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/ce4ixs/comment/eu1xazh/";

/** Quizchain2 block 71: `net zero`, one letter away from the question, with `carbon neutral` as the TOMI field. */
export const quizchain2Block71 = puzzle({
  id: "quizchain2/71",
  chain: "bitcoin",
  address: "16GdFrajmBkFjn3UqGckTaC3S32AGLdXw3",
  sourceUrl: THREAD,
  startedAt: "2019-07-16 13:06:24",
  status: Status.Solved,
  pubkey: compressed("021b061146636df729e9bf7089dea6febd1f4b176d5071dc8cc5371f52c2b4c835"),
  key: wif("KypgDQAuQT1qmf8aWpboJRhCHeXyCbeotEGWmcPH687mpTcBBeAL")
    .entropy(
      "4bcacee7f46c6dcb96531b8137d4688f",
      source(THREAD, "MD5 of two words, TOMI and two words"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.008,
  hints: [
    official("Question: not zero", THREAD, undefined, {
      answer: answer(
        'Solution was "net zero" which was almost exactly the same as the question and is a goal of climate policy. TOMI field was "carbon neutral", which is another way of saying this.',
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("Got it: net zero TOMI carbon neutral", PLAYER_COMMENT),
    }),
    official("FIrst three digits of MD5 hash are 4bc.", THREAD),
    official("Solution only hash: 48", THREAD),
    official("TOMI field only hash: bc3", THREAD),
  ],
  solvedAt: "2019-07-17 15:30:17",
  solveTime: 95_033,
  transactions: [
    funding(
      "db55d2c3e55539d77b6db69fe2f7c54c70c7ffc7b0d7c2fb11da0bc16fc23b4e",
      "2019-07-16 13:06:24",
      0.001,
    ),
    increase(
      "1b552b9773797f3f4b4dfedb332ac100764056c44ce567d2b8bf05af85e92549",
      "2019-07-16 13:07:04",
      0.007,
    ),
    claim(
      "b74ff907f043a2b01bcbe8f5f31137d3a5fc475d85d3bdc7d0e48420b502709d",
      "2019-07-17 15:30:17",
      0.00783476,
    ),
  ],
});
