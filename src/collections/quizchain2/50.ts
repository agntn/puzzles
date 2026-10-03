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

/** The block 50 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c5kst3/7_mbtc_quizchain_2_block_50/";

/** u/BrainForceOne's comment with the whole winning string and how they found it. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/c5kst3/comment/es2q2li/";

/** Quizchain2 block 50: `4oLvT2`, the checksum that turns twenty-one ones into a Bitcoin address, with `address checksum` in the TOMI field. */
export const quizchain2Block50 = puzzle({
  id: "quizchain2/50",
  chain: "bitcoin",
  address: "1FGJhLU2gR2ucNbWsayA5pV15WbFJsvqGS",
  sourceUrl: THREAD,
  startedAt: "2019-06-25 23:44:43",
  status: Status.Solved,
  pubkey: compressed("030ce01cec5d184e734c75768e3f25d6eb68f44ed09f567172047a9528445effc0"),
  key: wif("L56xZ3ZN8Js4i3rzpY2d5W6KtRBTcgesPPvhnkqrGLoCC95VBzUg")
    .entropy(
      "c3260755c216f2e1b081b2fac119814b",
      source(THREAD, "MD5 of the checksum, TOMI and two words"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: 111111111111111111111", THREAD, undefined, {
      answer: answer(
        'As explained by the winner in a comment below, solution was "4oLvT2" and TOMI field was "address checksum".',
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("4oLvT2 TOMI address checksum", PLAYER_COMMENT),
    }),
    official("First three digits of MD5 hash are c32.", THREAD),
    official("First digit of solution only Md5 hash is 8.", THREAD),
    official("First two digits of TOMI field only MD5 hash are 64.", THREAD),
  ],
  solvedAt: "2019-06-26 06:51:06",
  solveTime: 25_583,
  transactions: [
    funding(
      "7c3aa2558e55003dc96dec0ffaea8d90dbc02e63acdec4c3665014471e3266f9",
      "2019-06-25 23:44:43",
      0.007,
    ),
    claim(
      "1f69eaad1365d96783f39e8d8024187a993c8c7710e32f9b2c2c28f71925be76",
      "2019-06-26 06:51:06",
      0.006736,
    ),
  ],
});
