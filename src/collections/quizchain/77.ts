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

/** Where the question and the funding txid of block 77 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bkeggn/77_mbtc_quizchain_block_77/";

/** u/reddeneer's comment of July 15, 2019 in the thread. */
const PLAYER_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bkeggn/comment/ettcfmb/";

/** The author's comment of July 15, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bkeggn/comment/ettfzcx/";

/**
 * Quizchain block 77: the genesis address read as a puzzle the author credits to Satoshi: four
 * items from its left half, four from its right half read backwards, then TOMI, `Omit TOMI` and the
 * whole block 44 key, hashed with MD5 into BIP39 entropy, for 77 mBTC. It was funded four and a
 * half days before the post. After ten hints on Wattpad a player posted the eight items in July
 * 2019 and the author confirmed them. The claim had confirmed four minutes before that comment. No
 * source printed the hash or the key.
 */
export const quizchainBlock77 = bitcoinPuzzle({
  id: "quizchain/77",
  address: p2pkh("1FAAKpzFc2CGU6Yt51kAZv5f6dXZckRsMP", "9b4d49d5f8b33a08ebe2d848ed0e4b05eaa20b92"),
  sourceUrl: THREAD,
  startedAt: "2019-04-29 05:24:39",
  status: Status.Solved,
  pubkey: compressed("022dc47f1d1d04a171fb4a6a9f2b43ebc13cf5a6b77b195153f8863d4657c580fd"),
  key: wif("KzWuYrzjrYJXdRMA6SukNnuRUkFRycUq8WdfUgfkQ5k1t5quvNGk")
    .entropy(
      "684b250ea52c1e33a6f6143ded0e62e6",
      source(
        AUTHOR_COMMENT,
        "MD5 of the eight items a player posted and the author confirmed, TOMI, Omit TOMI and the whole block 44 key",
      ),
    )
    .derived(),
  prize: 0.077,
  hints: [
    official("Question: The solution is the puzzle.", THREAD, undefined, {
      answer: answer("1A1 efi2DM Hal Finney TS mN ihsotaS otomakaN", PLAYER_COMMENT),
    }),
    official(
      "Update: Use [solution] TOMI Omit TOMI [link], since that is what I hashed with in yet another mistake.",
      THREAD,
    ),
    official(
      "Link is full private key from unsolved block 44 (Du Hast), with L4VdZUD as first seven digits.",
      THREAD,
    ),
    official(
      "Solution format is eight items in two sets of four. Two items ciphertext and two items plaintext each, 44 read from left and 44 read from right.",
      THREAD,
    ),
    official(
      "Update: The solution written by Satoshi was that of block 46, the Bitcoin address of the Genesis block, reproduced for convenience here: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      THREAD,
    ),
  ],
  solvedAt: "2019-07-15 06:40:20",
  solveTime: 6_657_341,
  transactions: [
    funding(
      "bf2213192ca6c8c782a9795c6d3fc9a38a20cafee6452a88cdcf2fecad17ca16",
      "2019-04-29 05:24:39",
      0.077,
    ),
    claim(
      "b0a24545350a0e0cbb049a6e3207e1431c17ec3f5cead19bd675841af4e71290",
      "2019-07-15 06:40:20",
      0.07685965,
    ),
  ],
});
