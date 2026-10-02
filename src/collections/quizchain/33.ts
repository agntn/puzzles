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

/** Where the question and the funding txid of block 33 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bcmgqi/medium_7_mbtc_quizchain_block_33/";

/** The author's Wattpad chapter Complete Quizchain, with the question and solution of every first run block. */
const SOLUTIONS = "https://www.wattpad.com/720895205-second-complete-quizchain";

/** The author's comment of April 14, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bcmgqi/comment/ekuvi1b/";

/** The author's comment of April 14, 2019 in the thread. */
const AUTHOR_COMMENT_2 = "https://www.reddit.com/r/bitcoinpuzzles/comments/bcmgqi/comment/ekux6t7/";

/**
 * Quizchain block 33: the second half of Make America Think Harder, the BFUB field with two words
 * from block 35's answer and the last three characters of the block 32 key, hashed with MD5 into
 * BIP39 entropy. The subtraction was misdirection. No source printed the hash or the key.
 */
export const quizchainBlock33 = puzzle({
  id: "quizchain/33",
  chain: "bitcoin",
  address: "137SFKp9MPjymMQVk85oarHoaxUd9QyeiA",
  sourceUrl: THREAD,
  startedAt: "2019-04-13 03:17:45",
  status: Status.Solved,
  pubkey: compressed("025ad61882fbd1a289b07a27324f16225e4694e29bac6bf488f9707fd57a4e97b2"),
  key: wif("KwPtjU4XKtQ2oqdiQc9vgrhefAqi9egXS2PXi7PiHDewrfxzuHDD")
    .entropy(
      "fa19d83c0fabbaee989eced063c65834",
      source(
        THREAD,
        "MD5 of the answer, BFUB, two words from the block 35 answer and the last three characters of the block 32 key, separated by spaces",
      ),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: An easy math problem. 4231 minus 132.", THREAD, undefined, {
      answer: answer('Solution was "Think harder BFUB Yang hat".', SOLUTIONS),
    }),
    official(
      "Format: [solution] BFUB [BFUB text] [link]. Two words in BFUB field, first of them capitalized.",
      THREAD,
    ),
    official(
      "Solution of block 35 is massive hint for this one. Two BFUB words in this one are from the solution of block 35.",
      AUTHOR_COMMENT,
    ),
    official("Another hint. Solution is of the format [word1] [word2]", AUTHOR_COMMENT_2),
  ],
  solvedAt: "2019-04-14 08:27:20",
  solveTime: 104_975,
  transactions: [
    funding(
      "f06027a116dcb6f163fc3115ca013f146333c732357c18c85f293278eb657a3d",
      "2019-04-13 03:17:45",
      0.007,
    ),
    claim(
      "786fc5ca05d68343e7365492caecb74243e456a7e32e0c469ce96a713267f122",
      "2019-04-14 08:27:20",
      0.00688474,
    ),
  ],
});
