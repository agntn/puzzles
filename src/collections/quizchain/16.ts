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

/** Where the question and the funding txid of block 16 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bbeuye/medium_7_mbtc_quizchain_block_16/";

/**
 * Quizchain block 16: the handle of the author's 16th Twitter follower with its illegal `O` made
 * lowercase, a space and the last three characters of the block 15 key, hashed with MD5 into BIP39
 * entropy. No source printed the hash or the key.
 */
export const quizchainBlock16 = puzzle({
  id: "quizchain/16",
  chain: "bitcoin",
  address: "12jpR4kuvZwYqyEFAwEVPq3KKgekFYtent",
  sourceUrl: THREAD,
  startedAt: "2019-04-09 23:30:50",
  status: Status.Solved,
  pubkey: compressed("03b5242f46392c5161149181ff153be661d559487ce77422f9c5d89dccdd65a0a6"),
  key: wif("KzuMwz6AriziBq1R5HiYxPzk9f3WzEQ7QyWVhAr8pn8Dwu91FdfP")
    .entropy(
      "3b28447d7c7713c4f1477bca49a75c13",
      source(
        THREAD,
        "MD5 of the fixed handle, a space and the last three characters of the block 15 key",
      ),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official(
      "The question for block 16: 40 is an illegal number. Fix it. Format for the answer: [solution] [linking three digits from block 15]. Exactly one space between solution and chain link.",
      THREAD,
      undefined,
      {
        answer: answer(
          'Solution was derived from the handle name of my 16th follower at the Twitter feed, which is HE4OBEK. The "4O" in the middle is illegal in the Bitcoin address space, since people may be unable to distinguish "0" from "O". To fix it, replace it with lowercase o, for a solution string "HE4oBEK".',
          THREAD,
        ),
      },
    ),
    official("Update: Double-checking revealed that this block also was hashed with MD5.", THREAD),
  ],
  solvedAt: "2019-04-10 05:27:17",
  solveTime: 21_387,
  transactions: [
    funding(
      "602f53a24fecdb5face4b1ed7eecfa9e7ab78f995eb015f074aac89c7332968c",
      "2019-04-09 23:30:50",
      0.007,
    ),
    claim(
      "b909c46f87694505ca4531d34ef18cd017ae82c08d69b1e9e704f7fdd387825c",
      "2019-04-10 05:27:17",
      0.00679629,
    ),
  ],
});
