import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The block 36 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/bzodlf/7_mbtc_quizchain2_block_36/";

/** u/tdp94's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/bzodlf/comment/eqv47re/";

/** Quizchain2 block 36: `bit`, the ending `de` and `ha` share with `or`, and the three words in the TOMI field. */
export const quizchain2Block36 = puzzle({
  id: "quizchain2/36",
  chain: "bitcoin",
  address: "1Je4ZP3CGjtbwFJ5jwtkooG8JDYtzGwSMM",
  sourceUrl: THREAD,
  startedAt: "2019-06-12 00:22:24",
  status: Status.Solved,
  pubkey: compressed("0245b7dbabde52914ea813c8a43f1ce0e23c90f4c96c9ad49a6213584b0b6a9534"),
  key: wif("L2xsEcGgBu6qm27iiHahU3iST4YxgnCepknU8UDvtGVXmgwrUuv2")
    .entropy(
      "1dbf8dd28fd462b1aa1b867d83c3b696",
      source(THREAD, "MD5 of the word, TOMI and three words"),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: de or ha?", THREAD, undefined, {
      answer: answer('Solution was "bit" and TOMI field was "debit orbit habit".', THREAD),
    }),
    official("Format: [solution] TOMI [TOMI].", THREAD, undefined, {
      answer: answer("bit TOMI debit orbit habit", PLAYER_COMMENT),
    }),
    official("First three digits of MD5 hash are 1db.", THREAD),
    official("First digit of solution only MD5 hash is f.", THREAD),
    official("First two digits of TOMI field only MD5 hash are f9.", THREAD),
  ],
  solvedAt: "2019-06-12 11:47:57",
  solveTime: 41_133,
  transactions: [
    funding(
      "b36c5e5c202988acf471111a9f85c66dae766f41edde126974458e5cfa70d76a",
      "2019-06-12 00:22:24",
      0.007,
    ),
    claim(
      "e01719c30fcb413031f02a85d586b91bd72b45c909a57405eb3f11c554c98e8f",
      "2019-06-12 11:47:57",
      0.00678799,
    ),
  ],
});
