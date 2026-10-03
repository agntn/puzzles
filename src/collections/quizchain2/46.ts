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

/** The block 46 thread, with the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c3kyoe/7_mbtc_quizchain2_block_46/";

/** The author's reply of June 22, 2019 about the number 46. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/Grycoin/comments/c3kyoe/comment/errzuqj/";

/** The author's reply of June 22, 2019 with two digits of the solution hash. */
const DIGITS_COMMENT = "https://www.reddit.com/r/Grycoin/comments/c3kyoe/comment/ers3zsh/";

/** Quizchain2 block 46: `Andrew Yang`, the candidate the author backed, with `46th President of the United States` in the TOMI field. */
export const quizchain2Block46 = puzzle({
  id: "quizchain2/46",
  chain: "bitcoin",
  address: "18kKYiuT1AbAhmzgUQ2czuAv654EvhfzeJ",
  sourceUrl: THREAD,
  startedAt: "2019-06-22 01:28:44",
  status: Status.Solved,
  pubkey: compressed("02f64fe34e296f74f8506392eab4ad9ff595d1e578b16a9d0ab8cef6d19b6d0d99"),
  key: wif("L5UuTbqw3NpNs8GadheiAKokWX1HdgaWLr4vz5E3kuuEPB4vJANR")
    .entropy(
      "7c4031b60d8dc8dfa8ab8a21f4db865d",
      source(THREAD, "MD5 of the two words, TOMI and six words"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer(
        'Solution was "Andrew Yang" and TOMI was "46th President of the United States".',
        THREAD,
      ),
    }),
    official("TOMI field has six elements.", THREAD),
    official("First three digits of MD5 hash are 7c4.", THREAD),
    official("First digit of solution only MD5 hash is f.", THREAD),
    official("First two digits of TOMI field only MD5 hash are d3.", THREAD),
    official("This is about the number 46, but not about the Bitcoin space...", AUTHOR_COMMENT),
    official("f6", DIGITS_COMMENT),
  ],
  solvedAt: "2019-06-22 13:44:38",
  solveTime: 44_154,
  transactions: [
    funding(
      "2ca0f9512cba008c785c0f1a28a8f739d20965ac12d467c329eef34e47e8766c",
      "2019-06-22 01:28:44",
      0.007,
    ),
    claim(
      "6a43b61f5aee666d905bca82e1f7a952e204dfa86aca269a02d686c17988c370",
      "2019-06-22 13:44:38",
      0.00683001,
    ),
  ],
});
