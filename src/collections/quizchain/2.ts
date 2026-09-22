import {
  answer,
  claim,
  compressed,
  confirmation,
  funding,
  official,
  p2pkh,
  wif,
} from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

/** Where the question, the funding txid, the solution and the private key of block 2 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/badtpz/easy_7_mbtc_quizchain_block_2/";

/** The Wayback capture whose HTML carries the post with its solution edit. */
const CAPTURE =
  "https://web.archive.org/web/20230611110305/https://www.reddit.com/r/bitcoinpuzzles/comments/badtpz/easy_7_mbtc_quizchain_block_2/";

/**
 * Quizchain block 2: a sentence with one letter of an author's family name capitalized, the
 * rest of that name capitalized the same way, and the last three characters of the block 1 key
 * appended, hashed with SHA-256 into BIP39 entropy. The post names the funding transaction, not
 * the address, and the author edited the solution and the private key into it.
 */
export const quizchainBlock2 = bitcoinPuzzle({
  id: "quizchain/2",
  address: p2pkh("1JP2qF74zzgz6FMzsmk7nxUeYd7aYCAMHc", "bea4d18e2d7861e23df06c8d4a7ab51a05a12a48"),
  sourceUrl: THREAD,
  startedAt: "2019-04-07 06:57:24",
  status: Status.Solved,
  pubkey: compressed("031c4dc0e046216624b8b932ece5c6eadd13f746f0a549c48b329fb150a0e1269e"),
  key: wif("Kz6upYXvTYY7r8uYZsRuuyyhbcRvXe6tKDFusRKco31Vw2TLihBF"),
  prize: 0.007,
  hints: [
    official(
      "Question: The following sentence is the first in the top post of a certain subreddit I am following. One of the letters in the family name of the author is changed from lower to upper case. Change the other letters in his name in the same way for the solution.",
      THREAD,
      confirmation(CAPTURE, "Wayback capture of the post with the solution edit"),
      {
        answer: answer(
          "I posted A similar messaGe to the Basecamp, but had to also come visit You all here oN Reddit.",
          THREAD,
        ),
      },
    ),
    official(
      "Then append the last three digits from the private key of the solution to block 1. Do a SHA 256 hash on that and use as entropy in the Ian Coleman brain wallet tool.",
      THREAD,
    ),
    official(
      "Sentence: I posted A similar message to the Basecamp, but had to also come visit you all here on Reddit.",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-07 07:32:15",
  solveTime: 2091,
  transactions: [
    funding(
      "dd09d3f542576c7db2414fdfec68cb48757fca3e9d1c59142eaedb50b752620a",
      "2019-04-07 06:57:24",
      0.007,
    ),
    claim(
      "ccc30669f3961defc8c14b2a877dc16cabddb7dfa7c56770ef05e3940fbb7ba5",
      "2019-04-07 07:32:15",
      0.00682539,
    ),
  ],
});
