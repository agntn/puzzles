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

/** The block 55 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c7kv4m/77_mbtc_quizchain2_block_55/";

/** u/Randomiser's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/c7kv4m/comment/esfv105/";

/** Quizchain2 block 55: `FOMO`, a 77 mBTC block for the block 53 mistake, with `fear of missing out` in the TOMI field. */
export const quizchain2Block55 = puzzle({
  id: "quizchain2/55",
  chain: "bitcoin",
  address: "1oK2Tkiikgjj4D5wXebc7rZXtGaMVti4X",
  sourceUrl: THREAD,
  startedAt: "2019-06-30 09:31:18",
  status: Status.Solved,
  pubkey: compressed("03d3ecd156761abcbe8abcc52701afe2d25e3ad9ef4f78d7b260b69e18898165e3"),
  key: wif("KwYmWqLJtcbRT2dMtoU3VQvAzAqiAsi2D3tzydfjVvYYDy3tDUrr")
    .entropy(
      "48aa19ec8d0a8f6472c66693c4a7ef5f",
      source(THREAD, "MD5 of the acronym, TOMI and four words"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.077,
  hints: [
    official("Question: Be afraid. Be very afraid.", THREAD, undefined, {
      answer: answer("Solved at sight, solution was FOMO, TOMI was fear of missing out.", THREAD),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("FOMO TOMI fear of missing out", PLAYER_COMMENT),
    }),
    official("FIrst three digits of MD5 hash are 48a.", THREAD),
  ],
  solvedAt: "2019-06-30 23:03:40",
  solveTime: 48_742,
  transactions: [
    funding(
      "de3a5bc5bed98735094515dbeb2174c55bddbc928b2d4eff277ebcb9d714955a",
      "2019-06-30 09:31:18",
      0.077,
    ),
    claim(
      "ba0af11feae12f711949cc760160c4c2ad233b89913156ea2d8905b3e7458b50",
      "2019-06-30 23:03:40",
      0.07664518,
    ),
  ],
});
