import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 25 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bbwl11/easy_7_mbtc_quizchain_block_25/";

/**
 * Quizchain block 25: the 25th letter, a space and the last three characters of the block 24 key,
 * hashed with MD5 into BIP39 entropy. Claimed five minutes after funding. No source printed the
 * hash or the key.
 */
export const quizchainBlock25 = puzzle({
  id: "quizchain/25",
  chain: "bitcoin",
  address: "13ZuQHSeeJFYyyLN9CcYm1Lg9QJ65odk33",
  sourceUrl: THREAD,
  startedAt: "2019-04-11 06:25:41",
  status: Status.Solved,
  pubkey: compressed("025a285721813297978fc6079d742a8cbcb9469c54e5a38e824f6001b6ed125885"),
  key: wif("KxmrVCvyFVgFCdjYJv8eFF3bqbsg2QE9rS31rSF3V4Lodnneh6aC")
    .entropy(
      "a6456eec4c9150a81227889b710a23be",
      source(
        THREAD,
        "MD5 of the letter, a space and the last three characters of the block 24 key",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: Wait, but why?", THREAD, undefined, {
      answer: answer(
        "Solution was Y, as the 25th letter in the alphabet, chosen for block 25.",
        THREAD,
      ),
    }),
    official("Format:  [solution] [link] with exactly one space between them.", THREAD),
  ],
  solvedAt: "2019-04-11 06:30:37",
  solveTime: 296,
  transactions: [
    funding(
      "5a9ebb00e1256ffea8fae75cbe09492509071b01be586eb2a3628677ec7e46eb",
      "2019-04-11 06:25:41",
      0.007,
    ),
    claim(
      "57444c1698a7641d77579c2dfb531b76bec1c0b95eb928e71cfbbebc0c32a1f6",
      "2019-04-11 06:30:37",
      0.00669453,
    ),
  ],
});
