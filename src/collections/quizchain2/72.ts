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

/** The block 72 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/ces4vi/9_mbtc_quizchain2_block_72/";

/** u/LiaVl's comment with the whole winning string, posted a minute after the block. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/ces4vi/comment/eu4ifd8/";

/** Quizchain2 block 72: `GND`, the question's letters put back in order, with `Green New Deal` as the TOMI field. */
export const quizchain2Block72 = puzzle({
  id: "quizchain2/72",
  chain: "bitcoin",
  address: "147dHipPd9eF7UTWrsxQhGDDySAmDUhXeG",
  sourceUrl: THREAD,
  startedAt: "2019-07-18 06:29:28",
  status: Status.Solved,
  pubkey: compressed("02e39dd6a15bc7188123dc05db88bb3ff9ee3f5d4aa5a47424867c07d72073fc05"),
  key: wif("L1jF6nZiFYSCfXeRKVufyqzFku6xuAy5fasYowvPV7LuXqDww6uV")
    .entropy(
      "916133ad362df0d10f9f3a3e625d9b67",
      source(THREAD, "MD5 of the acronym, TOMI and three words"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.009,
  hints: [
    official("Question: NGD", THREAD, undefined, {
      answer: answer("Solution was GND and TOMI field was Green New Deal.", THREAD),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("GND TOMI Green New Deal", PLAYER_COMMENT),
    }),
    official("First three digits of MD5 hash are 916 (copypasted).", THREAD),
  ],
  solvedAt: "2019-07-18 08:59:59",
  solveTime: 9031,
  transactions: [
    funding(
      "8eca76a4b7793b6f8a0aed3b4f79d66d63846abde4c6590b8d0861694a572c3d",
      "2019-07-18 06:29:28",
      0.009,
    ),
    claim(
      "3a79fcbbe58ba33cdf6caf4273342ca40de9b8bde6b7564e22c5fec6527f125b",
      "2019-07-18 08:59:59",
      0.0089065,
    ),
  ],
});
