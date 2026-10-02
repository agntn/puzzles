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

/** Where the question and the funding txid of block 40 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bd2ug5/7_mbtc_quizchain_block_40/";

/** The author's comment of April 15, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bd2ug5/comment/ekxgugv/";

/**
 * Quizchain block 40: `hit`, found in the block 39 key, then BFUB, the three characters after it
 * there and the key's last three characters, hashed with MD5 into BIP39 entropy. The post calls it
 * block 40's key. The characters sit in block 39's. No source printed the hash or the key.
 */
export const quizchainBlock40 = puzzle({
  id: "quizchain/40",
  chain: "bitcoin",
  address: "1CAYmTna2haJvGNE83pmRmwfAMGw8Mmeqk",
  sourceUrl: THREAD,
  startedAt: "2019-04-14 13:10:37",
  status: Status.Solved,
  pubkey: compressed("02ddfb547cfb77ec443637ed908bc8fb21d9779929c596083088244473cb7d85b6"),
  key: wif("L3juV44PrD3fyUTYy2Ax8Z3nURNV7gLRRcbVYkqGACkLof6mHALc")
    .entropy(
      "21f5fc1446eb53170e4331c46a4c7914",
      source(
        THREAD,
        "MD5 of the word, BFUB, the three characters after it in the block 39 key and the last three characters of that key, separated by spaces",
      ),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: three letter word starting with h and ending with t", THREAD, undefined, {
      answer: answer(
        'The solution was the word "hit", since I noticed again that this word turned up in the private key of block 40.',
        THREAD,
      ),
    }),
    official(
      "BFUB is three capital letters. If you found the solution the correct way, you will find those three letters easily.",
      THREAD,
      undefined,
      {
        answer: answer(
          'Three digits of previous block private key following "hit" found there.',
          AUTHOR_COMMENT,
        ),
      },
    ),
    official(
      "Link from last block: Not provided this time, you need to solve last block to challenge this one.",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-14 14:21:11",
  solveTime: 4234,
  transactions: [
    funding(
      "7b186c9a4df407e356b2231f41fddb305c585d316c88a75a2f034e9b7e5e086e",
      "2019-04-14 13:10:37",
      0.007,
    ),
    claim(
      "f63d705638aa14a1d58bcdcb920d4c788770c8445a27b9a1eb69d42dbc559a4b",
      "2019-04-14 14:21:11",
      0.00666438,
    ),
  ],
});
