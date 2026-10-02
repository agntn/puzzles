import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 26 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bbwswp/solved_before_posting_7_mbtc_quizchain_block_26/";

/**
 * Quizchain block 26: the 26th letter, a space and the last three characters of the block 25 key,
 * hashed with MD5 into BIP39 entropy. A player guessed the pattern and claimed it in the funding
 * block, before the post existed. The post only reports it. No source printed the hash or the key.
 */
export const quizchainBlock26 = puzzle({
  id: "quizchain/26",
  chain: "bitcoin",
  address: "1Kg9XZFE81j2SjXekrAVCpgAkzDjbTBXeD",
  sourceUrl: THREAD,
  startedAt: "2019-04-11 06:47:40",
  status: Status.Solved,
  pubkey: compressed("0348eddbfcc56b18ce908a27eb622562179b6a444420fe7dff7427031f633ff7b0"),
  key: wif("L2zPMoXCWNqoqRhYNnQCpqY7dKNtc7xMT69VCBisk4LJvfGEmYQa")
    .entropy(
      "ddbafd159c1271f782154eea18b0dee2",
      source(
        THREAD,
        "MD5 of the letter, a space and the last three characters of the block 25 key",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official(
      "This block was a test case to see if someone was alert enough to see where the next block was going before I even posted it here.",
      THREAD,
      undefined,
      {
        answer: answer(
          "Answer for this one was Z, as this is the last occasion to do a single letter answer.",
          THREAD,
        ),
      },
    ),
  ],
  solvedAt: "2019-04-11 06:47:40",
  solveTime: 0,
  transactions: [
    funding(
      "c782a9a2300df8886893bdfa957f095be2006859568b15b69aeebcb5fca76535",
      "2019-04-11 06:47:40",
      0.007,
    ),
    claim(
      "7235eb8019d89aa745bb35c9f8ec64b844a943558a0a71918537f4bfe44b2d4f",
      "2019-04-11 06:47:40",
      0.00679648,
    ),
  ],
});
