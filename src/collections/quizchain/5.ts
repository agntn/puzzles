import {
  answer,
  claim,
  compressed,
  confirmation,
  funding,
  official,
  p2pkh,
  source,
  wif,
} from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

/** Where the question, the funding txid, the solution and the private key of block 5 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/baf89m/easy_7_mbtc_quizchain_block_5/";

/** The Wayback capture whose HTML carries the post with its updates and solution. */
const CAPTURE =
  "https://web.archive.org/web/20230611162510/https://www.reddit.com/r/bitcoinpuzzles/comments/baf89m/easy_7_mbtc_quizchain_block_5/";

/**
 * Quizchain block 5: Satoshi's 2009 answer to how many bitcoins a day of mining brought, in his
 * exact wording, with the last three characters of the block 4 key appended, hashed with SHA-256
 * into BIP39 entropy. The post names the funding transaction, not the address, and the author
 * edited the solution and the private key into it. The entropy hash is not printed; it is the
 * post's recipe run on the published solution, and it derives that key.
 */
export const quizchainBlock5 = bitcoinPuzzle({
  id: "quizchain/5",
  address: p2pkh("1JR9yiCGuMrKQ19pbt2GJudpv1c5ZvXxK2", "bf0b9d9c4d25a5fc9f4541ecc1c9fb5bd69e65fb"),
  sourceUrl: THREAD,
  startedAt: "2019-04-07 11:08:39",
  status: Status.Solved,
  pubkey: compressed("020d091a1ea789d090a1b9f95a8bdf6b538f71749cc08eeb921cc84ba79a3eb3f9"),
  key: wif("KwK9P8R81i3JRFt5Ne7xT92hUxbAyKtkcxJcESd9x2rrXKSwQKPb").entropy(
    "c534df8925c386ef2cad7502a427f478057357bc9210cb75e4845bd21762e1d5",
    source(
      THREAD,
      "SHA-256 of Satoshi's sentence with the last three characters of the block 4 key appended",
    ),
  ),
  prize: 0.007,
  hints: [
    official(
      "On this day ten years ago, how many bitcoins would you mine on average?",
      THREAD,
      confirmation(CAPTURE, "Wayback capture of the post with its updates and solution"),
      {
        answer: answer(
          'Satoshi answered this question on bitcointalk in 2009 like this: "Typically a few hundred right now."',
          THREAD,
        ),
      },
    ),
    official(
      'I skip explaining the format this time, if you don\'t know it, look at one of the previous "Quizchain" posts.',
      THREAD,
      undefined,
      {
        answer: answer(
          "Add last three digits of previous private key 6TX to claim the funds.",
          THREAD,
        ),
      },
    ),
    official(
      "Answer needs to be in exactly the same format as Satoshi's answer to this question in 2009.",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-07 12:49:32",
  solveTime: 6053,
  transactions: [
    funding(
      "ff591de99487f386be72fe6e8a624a45b40b6c3f89344445d68036c04ff4eb35",
      "2019-04-07 11:08:39",
      0.007,
    ),
    claim(
      "b4d5865834c268b76a3b1ff4a311b6467af82b2be5e863e3696a03791f667491",
      "2019-04-07 12:49:32",
      0.006435,
    ),
  ],
});
