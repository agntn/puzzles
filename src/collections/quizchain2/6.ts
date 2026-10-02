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

/** Where the question, the funding txid and the method of block 6 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/boviny/7_mbtc_quizchain2_block_6/";

/**
 * Quizchain2 block 6: the first six words of the block 5 mnemonic, hashed with MD5 into BIP39
 * entropy. The author edited the method into the post and printed the key as the link of block
 * 8, but no source printed the six words or the hash: the record runs the method on the block 5
 * key, and those words derive that key.
 */
export const quizchain2Block6 = puzzle({
  id: "quizchain2/6",
  chain: "bitcoin",
  address: "1741oPqNwSvJuGw5Zv4CrTCSov5LtqdrNq",
  sourceUrl: THREAD,
  startedAt: "2019-05-15 00:00:56",
  status: Status.Solved,
  pubkey: compressed("037c3fd6f4c0ff4278e448dc1eb3051eed8ca6771b21d8aed4d29f80dba80f76c9"),
  key: wif("L2gi9LjJwv6oRBdBAJMo3QTNmfdqLRYxbW7o1MhC5K7NNh2JqPSZ").entropy(
    "fb80ca6ac6ec967eeaece1e30d4a7654",
    source(THREAD, "MD5 of the first six words of the block 5 mnemonic"),
  ),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Six words.", THREAD, undefined, {
      answer: answer(
        "Solution method was to look in the coleman tool wordlist of the previous block solution, then use the first six words from that word list. The hoax was having a five word bat bot bit bet but puzzle in the block before, getting people to search in that wrong direction.",
        THREAD,
      ),
    }),
    official("Format: [word1 word2 word3 word4 word5 word6]", THREAD),
    official("One space between each word and no period at the end.", THREAD),
    official("First three digits of MD5 hash are fb8.", THREAD),
  ],
  solvedAt: "2019-05-15 22:11:41",
  solveTime: 79_845,
  transactions: [
    funding(
      "834218257ca87ad263c4ce6a64f32ab34424bd20c03c225cf5c25d28eb9e1dae",
      "2019-05-15 00:00:56",
      0.007,
    ),
    claim(
      "e0c856eaa9d14d2b7de9d1ba1fbfa77c08113a5247f3790243f335bc40877e86",
      "2019-05-15 22:11:41",
      0.00654976,
    ),
  ],
});
