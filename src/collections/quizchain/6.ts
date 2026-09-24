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

/** Where the question, the funding txid, the key suffix and the solution of block 6 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bafyoo/hard_7_mbtc_quizchain_block_6/";

/**
 * Quizchain block 6: two words in normal capitalization, a space, and the last three characters of
 * the block 5 key, hashed with SHA-256 into BIP39 entropy. The post names the funding transaction,
 * not the address. Nobody found the words while it ran, so the author printed only the last three
 * characters of the key, `MQz`, and after the claim edited the words into the post. Neither the
 * hash nor the key was ever printed: the record runs the post's recipe on the published words, and
 * the key it derives ends in `MQz` and matches the public key the claim revealed.
 */
export const quizchainBlock6 = bitcoinPuzzle({
  id: "quizchain/6",
  address: p2pkh("1FNJM8cABfhCEgVGKneVT8dnhaFaNw85AB", "9d98fa0ef687dd2701fc392558a710ad07d72401"),
  sourceUrl: THREAD,
  startedAt: "2019-04-07 16:18:11",
  status: Status.Solved,
  pubkey: compressed("03df2f84cb1a3f49cfdab70808b73626e687802ce33f712e8d7781512e02c776fd"),
  key: wif("L2Z1rzCuFPhH9HBkKjHhBhQw3YULpnGTwWjvVJAf2m2AvhDciMQz").entropy(
    "8d00e61b8c3ee3e8dbf990c104f1e719be79e76ec8466b8278828e0e42285a95",
    source(
      THREAD,
      "SHA-256 of the author's two words, a space and the last three characters of the block 5 key",
    ),
  ),
  prize: 0.007,
  hints: [
    official("Do you know another two words?", THREAD, undefined, {
      answer: answer(
        'The two words I was looking for were "Thank you". Please note that these two words are the first in all blocks from 7 on, so I actually got away with disclosing the answer right in the next block question.',
        THREAD,
      ),
    }),
    official(
      "The two words need to be input in normal capitalization and a space between them. And there should be a space between the second word and the last three digits of the private key for block 5.",
      THREAD,
    ),
    official(
      "Here are the last three digits of the private key, so I can move on to block 7. They are MQz.",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-08 11:26:31",
  solveTime: 68_900,
  transactions: [
    funding(
      "d3a9586c10e17a858e923e9249884f019de95a3130ce052f20d9622ef0eb6c5f",
      "2019-04-07 16:18:11",
      0.007,
    ),
    claim(
      "f7d3842301a540592b323983c4531666e4f0e3ba3e7ca810a2f2f2c16b83a545",
      "2019-04-08 11:26:31",
      0.00666438,
    ),
  ],
});
