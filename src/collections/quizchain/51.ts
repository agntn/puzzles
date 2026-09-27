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

/** Where the question and the funding txid of block 51 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bexc8c/7_mbtc_quizchain_block_51/";

/**
 * Quizchain block 51: the answer of the author's favorite block, TOMI, `title on cover` and the
 * last seven characters of the block 50 key, hashed with MD5 into BIP39 entropy. From here the
 * field is called TOMI. The update says block 21, whose answer is not `Second`. Block 19's is. No
 * source printed the hash or the key.
 */
export const quizchainBlock51 = bitcoinPuzzle({
  id: "quizchain/51",
  address: p2pkh("17mRF1q6ws8tZQj93KiKHjWRiXL5uSczbB", "4a374afc40d660131edb2b6749e99092e9173c23"),
  sourceUrl: THREAD,
  startedAt: "2019-04-19 10:07:24",
  status: Status.Solved,
  pubkey: compressed("02b0e6451e82fe2452929b574af6a5f3e94fb8128cfcc8e79e6c540aa762ddcf64"),
  key: wif("L1ozkMNDweE1F3wMMYm4qXrkgnpQDRX1RVx29RHmb5mFDHLKwhQ1")
    .entropy(
      "a5138d23c4ac92919ed8194a6f2c775e",
      source(
        THREAD,
        "MD5 of the favorite block's answer, TOMI, three words and the last seven characters of the block 50 key",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: What is my favorite block?", THREAD, undefined, {
      answer: answer(
        'Solution was block 21 with "Second" as a solution, and the TOMI field was "title on cover".',
        THREAD,
      ),
    }),
    official(
      "[solution] is not number of block, but [solution] of that block. TOMI field is necessary to stop people from just brute forcing with all 50 solutions, which I assume to be in a script cracking list somewhere. It has the format [word1 word2 word3], with all words in lower case.",
      THREAD,
    ),
    official("Link is zGVQQgk for this one.", THREAD),
  ],
  solvedAt: "2019-04-19 11:57:47",
  solveTime: 6623,
  transactions: [
    funding(
      "04b6f17719284532b10c0e02d4589bf1062bd6865aac06303bf61f4b22c1bd38",
      "2019-04-19 10:07:24",
      0.007,
    ),
    claim(
      "090d778d874b0eb1a0bc097ab196ffcfb7ba5de9fb0d11a3538530a4734e0370",
      "2019-04-19 11:57:47",
      0.00688851,
    ),
  ],
});
