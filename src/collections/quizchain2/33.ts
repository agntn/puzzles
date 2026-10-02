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

/** The block 33 thread, with the question, the funding txid, the four hints and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/bygeur/7_mbtc_quizchain2_block_33/";

/** u/Randomiser's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/bygeur/comment/eqqswj7/";

/** Quizchain2 block 33: `0078`, the place of `answer` in a BIP39 word list, with that list in the TOMI field. */
export const quizchain2Block33 = puzzle({
  id: "quizchain2/33",
  chain: "bitcoin",
  address: "1JcvYSVA8AzyYRT7Y6u1iepdKTagsQEk26",
  sourceUrl: THREAD,
  startedAt: "2019-06-09 04:20:20",
  status: Status.Solved,
  pubkey: compressed("028b9359244ef4511c1a271cf15192b321a3fb6f9deb24245834402edc7d7798fd"),
  key: wif("KyRE11sbA7SyDEuxWHwbhoNHYxmLY1DXsxiK177QNb3pYPPfSPTQ")
    .entropy(
      "b60c14d39a7984882f495cb7058474db",
      source(THREAD, "MD5 of the number, TOMI and four items"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Can you find the answer?", THREAD, undefined, {
      answer: answer(
        'Solution was 0078 which is the four digit number for the word "answer" in the "BIP 39 word list", which in turn was the TOMI field.',
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer(
        'The answer was 0078 TOMI BIP 39 word list - "answer" being the 78th word in the BIP-39 wordlist.',
        PLAYER_COMMENT,
      ),
    }),
    official("FIrst three digits of MD5 hash are b60.", THREAD),
    official("FIrst digit of solution only MD5 hash is f.", THREAD),
    official("FIrst digit of TOMI field only MD5 hash is 7.", THREAD),
    official(
      "First item of TOMI field is three capital letters, format XXX. There are four items in the TOMI field.",
      THREAD,
    ),
    official(
      "Hint 2: I did not come up with the method for this block by myself, but found it in a comment by one of the players.",
      THREAD,
    ),
    official('Last item of the TOMI field is the word "list".', THREAD),
    official('Format for solution is four digit number, like "0007".', THREAD),
  ],
  solvedAt: "2019-06-11 05:23:23",
  solveTime: 176_583,
  transactions: [
    funding(
      "c97d65c858d5009cdb3e2fdd95f3519f28c9c106af0f7205c7e770402047ac24",
      "2019-06-09 04:20:20",
      0.007,
    ),
    claim(
      "8f6b9c3c1e9446b0e72dcd2ee1798759631a8bf0a083bcc6e729a60af641035e",
      "2019-06-11 05:23:23",
      0.00681472,
    ),
  ],
});
