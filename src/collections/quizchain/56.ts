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

/** Where the question and the funding txid of block 56 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bfiy4t/7_mbtc_quizchain_block_56_3_of_3/";

/** The author's comment of May 7, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bfiy4t/comment/empn3qq/";

/** The author's comment of May 9, 2019 in the thread. */
const AUTHOR_COMMENT_2 = "https://www.reddit.com/r/bitcoinpuzzles/comments/bfiy4t/comment/emyrtue/";

/**
 * Quizchain block 56: `AOH`, TOMI, `I after H`, the word `link` by mistake and the last seven
 * characters of the block 55 key, hashed with MD5 into BIP39 entropy. It held for 19 days, until
 * the author published the answer and the stray word. The claim came 36 minutes later. No source
 * printed the hash or the key.
 */
export const quizchainBlock56 = puzzle({
  id: "quizchain/56",
  chain: "bitcoin",
  address: "1BzcsBweoKC8ZB41eDiY2zDtvWNf3Q6xvJ",
  sourceUrl: THREAD,
  startedAt: "2019-04-21 00:21:04",
  status: Status.Solved,
  pubkey: compressed("02d9a0c7769732c020a5da98e448051d3a12c40c40bc08aa96365f8fad0761f04a"),
  key: wif("L3BkpFux81BLe6kVmEbN1yDXy9sgvhv5epRmWYCtQ5USBBJRNw7D")
    .entropy(
      "780d592202605d081a555fed50c1e97f",
      source(
        THREAD,
        "MD5 of the answer and TOMI field with the word link the author owned up to and the last seven characters of the block 55 key",
      ),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: AOI Second", THREAD, undefined, {
      answer: answer(
        'Solution to this was AOH, with TOMI field I after H. So I should have hashed with "AOH TOMI I after H 64bSJfY" but actually hashed with "AOH TOMI I after H *link* 64bSJfY".',
        THREAD,
      ),
    }),
    official("Format: [Solution] TOMI [TOMI] [link]", THREAD),
    official("Use 64bSJfY as a link for this block.", AUTHOR_COMMENT),
    official("Three items in TOMI field are two capital letters and one word.", AUTHOR_COMMENT_2),
  ],
  solvedAt: "2019-05-10 09:31:17",
  solveTime: 1_674_613,
  transactions: [
    funding(
      "90c21e7ee612a05ca5356c7bbc0152c9321c5236be69d2af8c278e2a328eeb08",
      "2019-04-21 00:21:04",
      0.007,
    ),
    claim(
      "faf8572c26895a65c1a2100ec9127ccabe5e7b82c615bb66ba09bfacddd3c509",
      "2019-05-10 09:31:17",
      0.00682374,
    ),
  ],
});
