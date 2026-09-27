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

/** Where the question and the funding txid of block 37 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bcykn2/easy_7_mbtc_quizchain_block_37/";

/**
 * Quizchain block 37: `oo7`, BFUB, `0o` and the last three characters of the block 36 key, hashed
 * with MD5 into BIP39 entropy, for 10 mBTC. No source printed the hash or the key.
 */
export const quizchainBlock37 = bitcoinPuzzle({
  id: "quizchain/37",
  address: p2pkh("18EmMJviXB6akqNftbufhxWcLbvgj2Mv7P", "4f634f444be3bac0061f5778d90288969149704c"),
  sourceUrl: THREAD,
  startedAt: "2019-04-14 03:07:20",
  status: Status.Solved,
  pubkey: compressed("021e57eeddbfc69764bc34baa33ac77b6b81cd368d835f2405b02d91fff76dc134"),
  key: wif("L33R24DaXvjjeuB145crhBsesGK435CJoTHHgCu5JvS7Z13QCnhd")
    .entropy(
      "3ccc475a0c33eeefc5d33e7a0584a5ce",
      source(
        THREAD,
        "MD5 of the answer, BFUB, the hint and the last three characters of the block 36 key, separated by spaces",
      ),
    )
    .derived(),
  prize: 0.01,
  hints: [
    official("Question:  James Bond", THREAD, undefined, {
      answer: answer(
        "The only point here to find the solution was to replace the 0 in 007 for o, since 0 is not allowed in Bitcoin addresses. From there on my BFUB hint was simply 0o, meaning replace 0 for o.",
        THREAD,
      ),
    }),
    official(
      "Format: [solution] BFUB [BFUB string] [link] with exactly one space between them.",
      THREAD,
    ),
    official("Link from Block 36:vXY First two digits of hash: 3c", THREAD),
  ],
  solvedAt: "2019-04-14 06:18:36",
  solveTime: 11_476,
  transactions: [
    funding(
      "5654065b34c1652c0dee19034a7de7bf3999b43c9c20a3834f5834bf14928bea",
      "2019-04-14 03:07:20",
      0.01,
    ),
    claim(
      "b7171416aa3d02fb0ad61fe43b7fb1324efc7e2e7c4ef6f9bea3950c0c398091",
      "2019-04-14 06:18:36",
      0.00990554,
    ),
  ],
});
