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

/** Where the question and the funding txid of block 69 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bi6n0l/7_mbtc_quizchain_block_69/";

/** The author's comment of April 29, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bi6n0l/comment/em1zwhr/";

/**
 * Quizchain block 69: `WM`, 69 upside down in capitals, then TOMI, the first and last words of the
 * post's second sentence and the whole block 68 key, hashed with MD5 into BIP39 entropy. No source
 * printed the hash or the key.
 */
export const quizchainBlock69 = bitcoinPuzzle({
  id: "quizchain/69",
  address: p2pkh("1FLmbVXZ7nZX9acH9dCt9XFgZprsPtJShn", "9d4ee3d824d7bb02d0d029e5e15fbe76eb869f73"),
  sourceUrl: THREAD,
  startedAt: "2019-04-28 02:35:05",
  status: Status.Solved,
  pubkey: compressed("03ecc84ff6a3dfca65989abc5ab404508d6d43e349be1c2b118ad2adf5720fbfee"),
  key: wif("L38bpdbA3NMfgFJuewu3DjCc7kK8w4rpXDQ9hA53GhHyCKYvmtGA")
    .entropy(
      "fdc955d9312a542d589c644dfae9af0a",
      source(THREAD, "MD5 of the two letters, TOMI, two words and the whole block 68 key"),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: Upside down.", THREAD, undefined, {
      answer: answer(
        'Solution was WM and TOMI was "When them", which were the first and last words in the second sentence above.',
        THREAD,
      ),
    }),
    official(
      "Format of TOMI is [word1 word2] with capitalization obvious from the solution method.",
      THREAD,
    ),
    official(
      "What if solution is two capital letters? When will you find the TOMI for that?",
      AUTHOR_COMMENT,
    ),
  ],
  solvedAt: "2019-04-29 15:24:23",
  solveTime: 132_558,
  transactions: [
    funding(
      "06410fde10b6d144b429f6b19c793db00e9a5c5cc4909c6f73e0009f860f5183",
      "2019-04-28 02:35:05",
      0.007,
    ),
    claim(
      "48d5358a5b529e9c5710d39282f69a4d2ed8188493a2d5d92d1b91c2492c4007",
      "2019-04-29 15:24:23",
      0.00686022,
    ),
  ],
});
