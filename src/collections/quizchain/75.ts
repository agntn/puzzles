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

/** Where the question and the funding txid of block 75 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bk2207/12_mbtc_quizchain_block_75/";

/** The author's comment of May 5, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bk2207/comment/emk1zoq/";

/** The author's comment of May 5, 2019 in the thread. */
const AUTHOR_COMMENT_2 = "https://www.reddit.com/r/bitcoinpuzzles/comments/bk2207/comment/emjm7n3/";

/**
 * Quizchain block 75: the four letters of the divine name, TOMI, `Tetragrammaton` and the whole
 * block 74 key, hashed with MD5 into BIP39 entropy, for 12 mBTC. No source printed the hash or the
 * key.
 */
export const quizchainBlock75 = bitcoinPuzzle({
  id: "quizchain/75",
  address: p2pkh("1FBj2afbHnqRwuZJNhaLfUtJBfoWvQSie", "02aec6a27ae490449fc98f3c949b34132a82fc20"),
  sourceUrl: THREAD,
  startedAt: "2019-05-03 00:15:47",
  status: Status.Solved,
  pubkey: compressed("03a9a4d538c706d79496d11176cb566b4ca0100955c350c7b53a8dd2953cd18809"),
  key: wif("L1nfJExgS7PHmRb9aZcZjCijL2EJQuMJUi5ax5XJdSorBw8VNph8")
    .entropy(
      "a30e2a19ba6c1775017a176598998521",
      source(THREAD, "MD5 of the four letters, TOMI, the Greek name and the whole block 74 key"),
    )
    .derived(),
  prize: 0.012,
  hints: [
    official("Question: No one knows how to pronounce this four letter word.", THREAD, undefined, {
      answer: answer("It was YHWH and the TOMI field was Tetragrammaton.", THREAD),
    }),
    official(
      "Hint live at Twitter feed now. He who must not be named (NOT Voldemort)",
      AUTHOR_COMMENT,
    ),
    official(
      "Just posted the solution to block 74. The link for this block is L1myU8V1SzKbAvW51KcEaA6EvfpmffqNuTgMdmY45XpH99VyYMAm",
      AUTHOR_COMMENT_2,
    ),
  ],
  solvedAt: "2019-05-05 12:44:54",
  solveTime: 217_747,
  transactions: [
    funding(
      "886a71eeeeddf8ac61ef48b0faedb5ae8e257674472aaf9259e3f444e5aca60a",
      "2019-05-03 00:15:47",
      0.012,
    ),
    claim(
      "851d12ab621d3e7dfd368ceb61a524964290af888920fcdd30a5d2ab48237f68",
      "2019-05-05 12:44:54",
      0.0118,
    ),
  ],
});
