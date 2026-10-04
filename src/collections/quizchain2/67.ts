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

/** The block 67 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/cchy6l/77_mbtc_quizchain2_block_67/";

/** u/puzzleponky's comment with the solution and the Wikipedia page. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/cchy6l/comment/etn39ar/";

/** Quizchain2 block 67: `Thomas`, the almost anagram of Satoshi, with Hal Finney's full name as the TOMI field. */
export const quizchain2Block67 = puzzle({
  id: "quizchain2/67",
  chain: "bitcoin",
  address: "18o7TyCU1zkXCiC5sZSyxBFAn3Nntb4MAw",
  sourceUrl: THREAD,
  startedAt: "2019-07-12 12:23:19",
  status: Status.Solved,
  pubkey: compressed("02a3de51a75abc63e3c08038ea718b6c11d5cd19c2025a774bf1889b4fdc24946e"),
  key: wif("KzQPaLLjDdbLViJsFm4f7Z84cK8rSbod4qMncgUDey7MiNk6MHUD")
    .entropy(
      "f4738a19b8ad4b882331cc1ba74e9826",
      source(THREAD, "MD5 of the name, TOMI and the full name"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.077,
  hints: [
    official("Question: Satoshi is an almost perfect anagram of which name?", THREAD, undefined, {
      answer: answer(
        "Solution was Thomas and TOMI field was the complete name of Hal FInney as given at WIkipedia, which is Harold Thomas Finney II.",
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer('Solution was "Thomas TOMI Harold Thomas Finney II"', PLAYER_COMMENT),
    }),
    official("FIrst three digits of MD5 hash are f47.", THREAD),
  ],
  solvedAt: "2019-07-12 23:46:22",
  solveTime: 40983,
  transactions: [
    funding(
      "4385d66a41d92939005b5767fb0c77b44f89e30a7d379f4d61d3e0fc9ac6b6f2",
      "2019-07-12 12:23:19",
      0.077,
    ),
    claim(
      "6993b18a7fb7270694fb427faf838140d94a0cb7b212882bd053a0a7229b3e96",
      "2019-07-12 23:46:22",
      0.07683027,
    ),
  ],
});
