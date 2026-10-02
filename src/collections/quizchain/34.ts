import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 34 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bgttca/repost_of_quizchain_block_34/";

/**
 * Quizchain block 34: the word `Hoax`, found inside the block 33 prize address, then BFUB, that
 * address and the last three characters of the block 33 key, hashed with MD5 into BIP39 entropy.
 * The original post is gone. The author reposted it as it was on April 24, 2019, and that repost is
 * the source. No source printed the hash or the key.
 */
export const quizchainBlock34 = puzzle({
  id: "quizchain/34",
  chain: "bitcoin",
  address: "1G6wfwVAuKP3PEm1d1uxCnp5qp5icXhb8V",
  sourceUrl: THREAD,
  startedAt: "2019-04-13 04:25:18",
  status: Status.Solved,
  pubkey: compressed("03832963f22902be98dd78db0c79ad0f0b3b6ad381e0c0c531ea179ad7852565cc"),
  key: wif("L4jBHrfHn3WwUuvavT7ZcsuKoYCTcgKag25UwUPtsWDGNquFS2PG")
    .entropy(
      "fbe465894214fb65fe758a811a45bf21",
      source(
        THREAD,
        "MD5 of the word, BFUB, the block 33 prize address and the last three characters of the block 33 key, separated by spaces",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: Zhang Yingyu 1617", THREAD, undefined, {
      answer: answer(
        "Solution for this was the word Hoax, which was a lucky find in the funding address of the previous block. That funding address also went into the BFUB field for this block.",
        THREAD,
      ),
    }),
    official(
      "Solution is one word, capitalization will be evident. BFUB text is my favorite Bitcoin address.",
      THREAD,
    ),
    official("Link from previous block: HDD", THREAD),
  ],
  solvedAt: "2019-04-13 15:17:39",
  solveTime: 39_141,
  transactions: [
    funding(
      "8cd71559ef2ab01166ff087ad735370099021097f856a9a5fdc07868dfd67b2c",
      "2019-04-13 04:25:18",
      0.007,
    ),
    claim(
      "3262111816f75f0c4a672eea5fbc3cf6d161aa45b02b92ae7e1e1ed3b3562380",
      "2019-04-13 15:17:39",
      0.00673619,
    ),
  ],
});
