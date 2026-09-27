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

/** Where the question and the funding txid of block 66 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bhlpm2/2_of_3_7_mbtc_quizchain_block_66/";

/** The author's Wattpad chapter Complete Quizchain, with the question and solution of every first run block. */
const SOLUTIONS = "https://www.wattpad.com/720895205-second-complete-quizchain";

/**
 * Quizchain block 66: `SECOND`, TOMI, the text of a scheduled tweet and the whole block 65 key,
 * hashed with MD5 into BIP39 entropy. The author called it a road block: nobody could claim it, or
 * block 67, before the tweet. The author printed the WIF after the claim.
 */
export const quizchainBlock66 = bitcoinPuzzle({
  id: "quizchain/66",
  address: p2pkh("1NrRE3MtTWM91VsoRv8CKF7doSee35oMUE", "efb33ed6c5ae6a2d033befdb4bdd9d6eb15e18d0"),
  sourceUrl: THREAD,
  startedAt: "2019-04-26 12:21:11",
  status: Status.Solved,
  pubkey: compressed("03569bfa4099a7d8faafbe140c1947741ef1bb1a4abb4b37d3b37b07dae48b4e37"),
  key: wif("L3Ame7sfViKWacDRNr3SeNcTaFFKfRtWGUD74NWMLSR6AobdHGYZ").entropy(
    "e2f1619d48bc35d774b819d0b4985b3e",
    source(THREAD, "MD5 of the answer, TOMI, the text of the tweet and the whole block 65 key"),
  ),
  prize: 0.007,
  hints: [
    official("Question: Multiple choice. a) Second b) SECOND", THREAD, undefined, {
      answer: answer("SECOND", SOLUTIONS),
    }),
    official(
      "TOMI is unknown until the Tweet tomorrow. It is the full text of that Tweet. And [link] is the full private key of the previous block 65.",
      THREAD,
      undefined,
      {
        answer: answer(
          'Update: TOMI field for this is "The race starts now" (with no quotation marks).',
          THREAD,
        ),
      },
    ),
  ],
  solvedAt: "2019-04-27 01:21:32",
  solveTime: 46_821,
  transactions: [
    funding(
      "f59be34b9e33f19fdbfaad2fbd9e10a7d89e873b641168fcc7fe8ef0b8da1e86",
      "2019-04-26 12:21:11",
      0.007,
    ),
    claim(
      "7767019760c68cbd667e3255586cb600f9abee6dfb32b049d28e7f45c003c987",
      "2019-04-27 01:21:32",
      0.00673677,
    ),
  ],
});
