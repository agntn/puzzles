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

/** Where the question and the funding txid of block 68 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bi593l/7_mbtc_quizchain_block_68/";

/** u/silver_anth's comment of April 28, 2019 in the thread. */
const PLAYER_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bi593l/comment/elyaozh/";

/**
 * Quizchain block 68: the ten characters after the first `p` in the block 67 key, TOMI, a fixed
 * text and that whole key, hashed with MD5 into BIP39 entropy. A player posted the whole string,
 * and the author's update confirms the method. No source printed the hash or the key.
 */
export const quizchainBlock68 = puzzle({
  id: "quizchain/68",
  chain: "bitcoin",
  address: "1N4ELRkHz1VvPPvLTFCvrimB5Bpc5GeMgC",
  sourceUrl: THREAD,
  startedAt: "2019-04-28 00:19:15",
  status: Status.Solved,
  pubkey: compressed("0356cb142522e26c2d8f2c354ca731bc1b7a18682abf2f65e2983f8a5956c070da"),
  key: wif("L3sNURL6cGcUznFx8ZKtoJwpZWgpRmXP9PMmxTY3nktuUqbaVxgs")
    .entropy(
      "a1b5c2d55a62b2d46dc997fbeda97dd1",
      source(
        THREAD,
        "MD5 of the ten characters after the first p of the block 67 key, TOMI, the fixed text and that whole key",
      ),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Looking for a 10 digit password.", THREAD, undefined, {
      answer: answer(
        'For one, I did not take any 10 digits, but the 10 following the first "p" in the private key, with the "p" standing for "password" in my mind.',
        THREAD,
      ),
    }),
    official(
      "Format: [solution] TOMI Will use puzzle by Satoshi for block 77 [link]",
      THREAD,
      undefined,
      {
        answer: answer(
          "SnFznkzqot TOMI Will use puzzle by Satoshi for block 77 L5KYypSnFznkzqotEVAWTaMvhDXjAqYYejKF8pDw8TgtGEx1mxfe",
          PLAYER_COMMENT,
        ),
      },
    ),
    official("Link is full private key from previous block 67 (Why Nakamoto?).", THREAD),
  ],
  solvedAt: "2019-04-28 01:21:18",
  solveTime: 3723,
  transactions: [
    funding(
      "46ea894ed585d5756c73c0b7b5ca144cc2c24c5aa876adc5a9ecea51a160bea8",
      "2019-04-28 00:19:15",
      0.007,
    ),
    claim(
      "fea9786b2da5f441bb7a005a99f6d045d87b08b7042d344ba2ddff042a418761",
      "2019-04-28 01:21:18",
      0.00692818,
    ),
  ],
});
