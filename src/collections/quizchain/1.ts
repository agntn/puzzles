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

/** Where the question, the funding txid and every hint of block 1 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bacd6l/easy_7_mbtc_quizchain_experiment/";

/** The author's comment with the solution string, its SHA-256 and the private key. */
const SOLUTION = "https://www.reddit.com/r/bitcoinpuzzles/comments/bacd6l/comment/ekaqb0l/";

/** The one Wayback capture whose HTML still carries the post and every comment. */
const CAPTURE =
  "https://web.archive.org/web/20230611083439/https://old.reddit.com/r/bitcoinpuzzles/comments/bacd6l/easy_7_mbtc_quizchain_experiment/";

/**
 * Quizchain block 1: one multiple-choice answer with the last three characters of the author's
 * favorite address appended, hashed with SHA-256 into BIP39 entropy. The post names the funding
 * transaction, not the address, and the author published the key in the comments.
 */
export const quizchainBlock1 = bitcoinPuzzle({
  id: "quizchain/1",
  address: p2pkh("16NLaozWwi4JSTRMnMfi3oCkBjXBWVFgYR", "3ae1b60c6a83290db2e9c228413750d96be80116"),
  sourceUrl: THREAD,
  startedAt: "2019-04-07 03:31:37",
  status: Status.Solved,
  pubkey: compressed("028a941c0effd36b57654b9bf871817384f5bd06286cebe73096191bc3584acef3"),
  key: wif("L58cp8Ex3RsTsiKaaeodmu7SetzDzqQkzfX3bAtjdtmu4KbTpUzp").entropy(
    "50611e63a52089bc14e38becb1ad8880be6ba8f4aff0e64223f3dbd740adc1b7",
    source(SOLUTION, "SHA-256 of answer b) with the last three characters of the address appended"),
  ),
  prize: 0.007,
  hints: [
    official(
      "Solve this multiple choice question: a) Satoshi is CEO of Bitcoin and holds the Bitcoin patent. b) Satoshi is an anonymous cypherpunk and the first one to succed building private Internet cash.",
      THREAD,
      confirmation(CAPTURE, "Wayback capture of the thread, post and comments"),
    ),
    official("Hint: The correct answer is b).", THREAD),
    official(
      'Add the last 3 digits of my favorite Bitcoin address to the text of alternative b). For example, if that address ends in "abc" take the string "Satoshi is an anonymous cypherpunk and the first one to succed building private Internet cash.abc".',
      THREAD,
      undefined,
      {
        answer: answer(
          "Satoshi is an anonymous cypherpunk and the first one to succed building private Internet cash.Pzd",
          SOLUTION,
        ),
      },
    ),
    official(
      "Take a SHA 256 hash of that and use it as entropy in the Ian Coleman BIP 39 tool. Find the private key in the first address of that wallet at the bottom.",
      THREAD,
    ),
    official("Good luck finding my favorite Bitcoin address.", THREAD, undefined, {
      answer: answer("1AndrewYangForPresident2o2o6zmPzd", SOLUTION),
    }),
    official(
      "Edit: I messed up. This quiz as posted was not valid. Edited slightly to reflect correct wording of answer b).",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-07 05:39:30",
  solveTime: 7673,
  transactions: [
    funding(
      "808aaa64d0028a6033b2c11a8ab59bc67df2758f4560f15158879a61270da7bb",
      "2019-04-07 03:31:37",
      0.007,
    ),
    claim(
      "5a99de28f54d3eee464878ddae0f12c865d4226a4572659cdba080fb568fa779",
      "2019-04-07 05:39:30",
      0.00672314,
    ),
  ],
});
