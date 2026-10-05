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

/** The block 74 thread, with the question, the funding txid and the hash digits. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/cfhi1e/11_mbtc_quizchain2_block_74/";

/** u/puzzleponky's comment with the whole winning string, the only place the solution was published. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/cfhi1e/comment/euj5k1u/";

/** Quizchain2 block 74: `PETM`, the Paleocene warming from the Wattpad chapter, with `second time now` as the TOMI field. */
export const quizchain2Block74 = puzzle({
  id: "quizchain2/74",
  chain: "bitcoin",
  address: "1P1BFMU7vnpzsaUtQCAvArVKQyeMgYtmPY",
  sourceUrl: THREAD,
  startedAt: "2019-07-20 03:43:27",
  status: Status.Solved,
  pubkey: compressed("03fe4d3f4476813e446c6f2043ef98eb28f5d1fcfadaa2c73dffc5d8b0736f2dc8"),
  key: wif("L5FNDLpbFyJkKY3JgHaFHKhRpXkiNkhCVDd9fRUiJZBZreCxZDRz")
    .entropy(
      "c65cb6a1680a40c8990882efd74ad7e9",
      source(PLAYER_COMMENT, "MD5 of the acronym, TOMI and three words"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", PLAYER_COMMENT)],
  prize: 0.011,
  hints: [
    official("Question: A long time ago on a planet near to us", THREAD, undefined, {
      answer: answer(
        "PETM being https://en.wikipedia.org/wiki/Paleocene%E2%80%93Eocene_Thermal_Maximum never heard of it until it was mentioned in the last chapter on Wattpad",
        PLAYER_COMMENT,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer('Solved! solution was "PETM TOMI second time now".', PLAYER_COMMENT),
    }),
    official("First three digits of MD5 hash are c65 (copypasted).", THREAD),
    official(
      "I posted a hint for this block yesterday as an update to the Wattpad story, may be difficult to solve without that context.",
      THREAD,
    ),
    official("Update: First two digits of solution only hash are 04.", THREAD),
  ],
  solvedAt: "2019-07-23 05:30:04",
  solveTime: 265_597,
  transactions: [
    funding(
      "f2623d2b4679277ed587c6031ebd3662bc4b72387828b62c8975d14860cf1854",
      "2019-07-20 03:43:27",
      0.011,
    ),
    claim(
      "31df04e8bc1516d2a06b5a1aed1c4ca1bd1b4e72df504adbd0230bc2051551bc",
      "2019-07-23 05:30:04",
      0.01085984,
    ),
  ],
});
