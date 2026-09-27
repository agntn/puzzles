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

/** Where the question and the funding txid of block 45 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bdrcj7/7_mbtc_7_mbtc_11_mbtc_quizchain_blocks_45_to_47/";

/** u/BrainForceOne's comment of April 23, 2019 in the thread. */
const PLAYER_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bdrcj7/comment/elkiinm/";

/**
 * Quizchain block 45: `Bitcoin` with every letter moved one back in the alphabet, a fixed BFUB text
 * and a link of seven characters, hashed with MD5 into BIP39 entropy. Block 44 was still open, so
 * the author set the link instead: `Da6Sn4J` sits in the block 44 key three characters before its
 * end. First of three blocks in one post. No source printed the hash or the key.
 */
export const quizchainBlock45 = bitcoinPuzzle({
  id: "quizchain/45",
  address: p2pkh("1KDnYd2LJwBfm74vv7VVP6kX3G74mUn2cP", "c7dd465d4035e9f23827d4c10351508045f3993d"),
  sourceUrl: THREAD,
  startedAt: "2019-04-16 00:24:33",
  status: Status.Solved,
  pubkey: compressed("023164c0fb8c260c3010006309158b27ae6ae0f52ba1d398a9d15f336113f514b0"),
  key: wif("Kz8sAdfB3SfP51H8WCpRt1jXGn8GrhJMHuyPwpotaSfqdgAELXgr")
    .entropy(
      "66fd83ff6aacd8c9618c015ecb132701",
      source(
        THREAD,
        "MD5 of Bitcoin with every letter shifted one back, the fixed BFUB text and the link the post set",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: Bitcoin Second", THREAD, undefined, {
      answer: answer(
        'That is because this time the solution is shifting ALL letters in "Bitcoin" to the letter before in the alphabet, as opposed to shifing only the first in the other block.',
        THREAD,
      ),
    }),
    official("Format: [solution] BFUB Have fun with this block Da6Sn4J", THREAD, undefined, {
      answer: answer('"Ahsbnhm BFUB Have fun with this block Da6Sn4J"', PLAYER_COMMENT),
    }),
    official("Link for this is set to Da6Sn4J.", THREAD),
  ],
  solvedAt: "2019-04-16 19:14:41",
  solveTime: 67_808,
  transactions: [
    funding(
      "8514df7faec741d53faca908df5ccc855c760430759a2b5a12bf74ce00150f51",
      "2019-04-16 00:24:33",
      0.007,
    ),
    claim(
      "4a726f795ce239115e948e08cff868013c651ce68de1f3fcb54be8cca8fddf2e",
      "2019-04-16 19:14:41",
      0.00690707,
    ),
  ],
});
