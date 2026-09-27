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

/** Where the question and the funding txid of block 70 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bilvsq/7_mbtc_quizchain_block_70/";

/** u/puzzleponky's comment of April 29, 2019 in the thread. */
const PLAYER_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bilvsq/comment/em2p40p/";

/**
 * Quizchain block 70: the coinbase address of Bitcoin block 70, TOMI, a fixed text and the whole
 * block 69 key, hashed with MD5 into BIP39 entropy. A player printed the WIF in the block 71
 * thread.
 */
export const quizchainBlock70 = bitcoinPuzzle({
  id: "quizchain/70",
  address: p2pkh("14q5gN69NHBKptffrrmxhST2qjGZCB3i8T", "2a003fc406c1b6c32fdfa595fac8af4e713581e4"),
  sourceUrl: THREAD,
  startedAt: "2019-04-29 05:33:32",
  status: Status.Solved,
  pubkey: compressed("03cf1f333e1e7df422613456c8f16f7861bb92222c11a0346241eb14743437cbf0"),
  key: wif("KzeCckbvmKAWs1JvDqX9VHKWETNyNwUZYCQY6Pvyv7BoUj8MCe6c").entropy(
    "a945917b956796976029e198881b3d68",
    source(THREAD, "MD5 of the address, TOMI, the fixed text and the whole block 69 key"),
  ),
  prize: 0.007,
  hints: [
    official("Question: Looking for yet another Bitcoin address.", THREAD, undefined, {
      answer: answer(
        "As already explained in comments, solution was the coinbase funding address of the other chain block 70.",
        THREAD,
      ),
    }),
    official(
      "Format: [solution] TOMI Anyone find Satoshi's puzzle yet? [link]",
      THREAD,
      undefined,
      {
        answer: answer(
          "Solution is address 1NnYa2jL24hLgXBbk3TAXHANUQEzXNnSHg which is the address of Block #70 on the Bitcoin blockchain",
          PLAYER_COMMENT,
        ),
      },
    ),
    official("Link is the full private key from block 69.", THREAD),
  ],
  solvedAt: "2019-04-29 17:15:52",
  solveTime: 42_140,
  transactions: [
    funding(
      "c33b1d66b1af5a7352408d67746d0f39e229bc87945d0794f2b4b2a6fe9cb6aa",
      "2019-04-29 05:33:32",
      0.007,
    ),
    claim(
      "f75c63691c6f44b4938f0bfc49f873eb83068d7f519d3ac70e3e5565e31158a7",
      "2019-04-29 17:15:52",
      0.00690669,
    ),
  ],
});
