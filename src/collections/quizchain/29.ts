import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 29 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bc6rkn/easy_7_mbtc_quizchain_block_29/";

/**
 * Quizchain block 29: a second version of a draft chapter the post prints in full, with `voice`
 * changed to `vOIce`, a space and the last three characters of the block 28 key, hashed with MD5
 * into BIP39 entropy. The string keeps the draft's line feeds, 1,360 bytes in all. The funding sent
 * 7.7 mBTC by mistake. No source printed the hash or the key.
 */
export const quizchainBlock29 = puzzle({
  id: "quizchain/29",
  chain: "bitcoin",
  address: "1BQiU45feRw5UKdCUbXuoNfuK5WRzTpa4P",
  sourceUrl: THREAD,
  startedAt: "2019-04-11 23:41:59",
  status: Status.Solved,
  pubkey: compressed("03183d03300c902724c89e15fd95055984aacc49e01a5285ca7f26bb4b90104289"),
  key: wif("Ky2NXmPfzm1tZRoRWyEcFoY5Q63NZNZNt9HQQF7pHQJyb6WZKJRu")
    .entropy(
      "982301b80b30af3a0abe110269b0dd43",
      source(
        THREAD,
        "MD5 of the draft the post printed with voice changed to vOIce, a space and the last three characters of the block 28 key",
      ),
    )
    .derived(),
  prize: 0.0077,
  hints: [
    official("Question: Second version.", THREAD, undefined, {
      answer: answer(
        'Solution: just change the o and i in "voice" in the second sentence to "O" and "I", same method as in Block 2.',
        THREAD,
      ),
    }),
    official("Format: [solution] [link] with exactly one space between them.", THREAD),
    official("Update: Copypaste from my draft, exactly same as used for hashing:", THREAD),
  ],
  solvedAt: "2019-04-12 12:25:08",
  solveTime: 45_789,
  transactions: [
    funding(
      "b49ebc67d4fc54143b0a934441224f6abeb4749d24f7e14776294dfdfeaa7d77",
      "2019-04-11 23:41:59",
      0.0077,
    ),
    claim(
      "268840ab0b0a31d5cace7fcb69424087f5e2bbaaecaac58f9e4452ddd569d750",
      "2019-04-12 12:25:08",
      0.00739491,
    ),
  ],
});
