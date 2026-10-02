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

/** The block 39 thread, with the question, the funding txid, the hash digits and the hint. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c0x0r5/7_mbtc_quizchain2_block_39/";

/** u/puzzleponky's comment with the whole winning string, the only place the solution was published. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/c0x0r5/comment/erc4b0f/";

/** Quizchain2 block 39: `four five nine`, the numbers missing from the BIP39 word list, with that list in the TOMI field. */
export const quizchain2Block39 = puzzle({
  id: "quizchain2/39",
  chain: "bitcoin",
  address: "1DnWLtG4pWafyAAkoqgqRYheWZ6B5vs7V9",
  sourceUrl: THREAD,
  startedAt: "2019-06-15 01:25:24",
  status: Status.Solved,
  pubkey: compressed("02a160b7e110f696270f7c072fd8c3a7a25eae78edfb36d87de10aa90e8f127274"),
  key: wif("L2vedu3Yh8sX99aZ9ErUHVPKPyAycsJyy245AEF7J9zKQ4kM2S9b")
    .entropy(
      "4018450f7a8e2353908fe3cc25a7d070",
      source(PLAYER_COMMENT, "MD5 of the three words, TOMI and five items"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", PLAYER_COMMENT)],
  prize: 0.007,
  hints: [
    official("Question: Ten words there are. Missing of them there are three.", THREAD, undefined, {
      answer: answer(
        "You can find the numbers one, two, three, six, seven, eight, and ten as words in the BIP 39 list but four, five, and nine are missing.",
        PLAYER_COMMENT,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("four five nine TOMI BIP 39 word list numbers", PLAYER_COMMENT),
    }),
    official(
      "Format for solution is [word1] [word2] [word3] with all three words all lower case.",
      THREAD,
    ),
    official("Format for TOMI field is five items.", THREAD),
    official("FIrst three digits of MD5 hash are 401.", THREAD),
    official("First two digits of solution only MD hash are 8d.", THREAD),
    official("FIrst two digits of TOMI field only MD hash are 4c.", THREAD),
    official(
      "Used before this method I have, but a better match it is to this block number.",
      THREAD,
    ),
  ],
  solvedAt: "2019-06-16 16:22:31",
  solveTime: 140_227,
  transactions: [
    funding(
      "1a2661ab6d6fab5c33bb8bb4669f8d2b8ccb067737a5adcfcfeccac6847f01ad",
      "2019-06-15 01:25:24",
      0.007,
    ),
    claim(
      "5660df99757997eec89836e2acec8d54c78ade5b6928376e593633e4be5ac483",
      "2019-06-16 16:22:31",
      0.00686906,
    ),
  ],
});
