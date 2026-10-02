import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 14 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bb4ifd/easy_7_mbtc_quizchain_block_14/";

/** The author's comment of April 9, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bb4ifd/comment/ekgsfs9/";

/**
 * Quizchain block 14: the English meanings of the two kanji that join 和 in the era names Showa and
 * Reiwa, with the last three characters of the block 13 key the author printed, hashed with SHA-256
 * into BIP39 entropy. No source printed the hash or the key.
 */
export const quizchainBlock14 = puzzle({
  id: "quizchain/14",
  chain: "bitcoin",
  address: "172tqKBumVhmVs3RRkJJcrG5S3Euje3A1H",
  sourceUrl: THREAD,
  startedAt: "2019-04-09 06:30:15",
  status: Status.Solved,
  pubkey: compressed("02fbe7dabef7509abe65f38bf6e786c185322c7494b50adcc2bec6b241fe6382ce"),
  key: wif("L4biaV2XFb18KWPxyZ4BUr3XBUh3t9u5X9FneQVXBVn3sxtjJZNb")
    .entropy(
      "5d88d03fe3fc3372a25f4b660a3db98dad685eaf1665dc8f4eff21f672abba30",
      source(
        THREAD,
        "SHA-256 of the two words and the last three characters of the block 13 key, separated by spaces",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: Two words with harmony. Format: word 1 word 2 xhm.", THREAD, undefined, {
      answer: answer(
        "The solution for this block was luminous command. The reason is that the Showa era used the kanji 昭 together with harmony and the Reiwa era is using 令 together with harmony.",
        THREAD,
      ),
    }),
    official("Hint: This has been big news in Japan about a week ago.", THREAD),
    official(
      'It is correct to think of Reiwa, but that is only one word joining "harmony". I am looking for word1 harmony word2 harmony. Also, the meaning for Rei in the comments will not work.',
      THREAD,
    ),
    official("Both words lowercase.", AUTHOR_COMMENT),
  ],
  solvedAt: "2019-04-09 18:55:17",
  solveTime: 44_702,
  transactions: [
    funding(
      "ed6ec05ed93de0fd8a64cee879a87d8d5d24c50ceecea6e85f6266e423085625",
      "2019-04-09 06:30:15",
      0.007,
    ),
    claim(
      "bc026c9837ed487f68becc9cddfd259376a97fbf18d7fae4185b92115c1ac9ed",
      "2019-04-09 18:55:17",
      0.006,
    ),
  ],
});
