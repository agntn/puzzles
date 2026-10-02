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

/** The block 34 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/byqc7s/7_mbtc_quizchain2_block_34/";

/** Quizchain2 block 34: `HQ IP`, read two places off an Atbash foldover. */
export const quizchain2Block34 = puzzle({
  id: "quizchain2/34",
  chain: "bitcoin",
  address: "1KKwHrjhNgsdqgDx913TYsgjRR5i8YhQoH",
  sourceUrl: THREAD,
  startedAt: "2019-06-09 09:16:31",
  status: Status.Solved,
  pubkey: compressed("02a09f97e9a421f08ceaa3439ad0175c3acb42c4933d4cc9fe5bd62e968f3f376d"),
  key: wif("L2t4m7TU8PA3FzkzRJNf4ohjyjGSkWKrNFUxwgysdm5ZpfGDEqY8")
    .entropy(
      "83652f90088e310fb0c70da77d47e691",
      source(THREAD, "MD5 of the two pairs, TOMI and six words"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD), technique("atbash", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: HI there", THREAD, undefined, {
      answer: answer(
        'Solution was "HQ IP" and the whole TOMI field was "Atbash foldover two to the right".',
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD),
    official(
      'Solution format is two sets of two capital letters XX XX. FIrst two words of TOMI field are "Atbash foldover", followed by four other words.',
      THREAD,
    ),
    official("FIrst three digits of MD5 hash are 836.", THREAD),
    official("First digit of solution only MD5 hash is 1.", THREAD),
    official("FIrst two digits of TOMI field only MD5 hash are 42.", THREAD),
  ],
  solvedAt: "2019-06-10 21:58:04",
  solveTime: 132_093,
  transactions: [
    funding(
      "026c52e2ae9290b79836eb7010aa0587a043fa1754f043b98cd08f5c3a74c1df",
      "2019-06-09 09:16:31",
      0.007,
    ),
    claim(
      "b56642d7db17df6f635b4bbe07f1aea129881a3a20c9820098cd50a98dfb9dc4",
      "2019-06-10 21:58:04",
      0.0068,
    ),
  ],
});
