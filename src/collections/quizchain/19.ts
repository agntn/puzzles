import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 19 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bbkh2q/exceedingly_easy_7_mbtc_quizchain_block_19/";

/** The author's Wattpad chapter Complete Quizchain, with the question and solution of every first run block. */
const SOLUTIONS = "https://www.wattpad.com/720895205-second-complete-quizchain";

/**
 * Quizchain block 19: the capitalized one of two alternatives, a space and the last three
 * characters of the block 18 key, hashed with MD5 into BIP39 entropy. The post calls it a second
 * prize for whoever solves block 18, and it was claimed in the same block as 18. No source printed
 * the hash or the key.
 */
export const quizchainBlock19 = puzzle({
  id: "quizchain/19",
  chain: "bitcoin",
  address: "1MTh3kQjS14L9kvEUrFkYGiNdcWGDim1La",
  sourceUrl: THREAD,
  startedAt: "2019-04-10 10:55:13",
  status: Status.Solved,
  pubkey: compressed("03b9f9f0b7b70e97aa41dec7623b78acfbe02e54cb12cc051e75d7387b30a43b65"),
  key: wif("L5JhgYPfwdjDBQNffXP7xTaSS1FxhXVrjZKQ9QGsXeZue5j6A6AX")
    .entropy(
      "db8042ccb8c1a645704170062daa0053",
      source(
        THREAD,
        "MD5 of the second alternative, a space and the last three characters of the block 18 key",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official(
      "Question: Multiple choice, two alternatives. a) second b) Second",
      THREAD,
      undefined,
      {
        answer: answer("Second.", SOLUTIONS),
      },
    ),
    official(
      "First alternative is second, and second alternative is Second. Hint: I don't think the first alternative is correct in this case, the second one looks much more promising. Format [solution] [link] with exactly one space between them. Hash with MD5 like with all blocks since 15.",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-10 10:55:13",
  solveTime: 0,
  transactions: [
    funding(
      "f68bc202e525eb02ac60c0a4b497bfda26bdadb02ec91b7e8cf24f248195f674",
      "2019-04-10 10:55:13",
      0.007,
    ),
    claim(
      "dae4dd121c4d59fbde4d8d2ddee49179aded36a825584f8272fdcc563e795b2b",
      "2019-04-10 10:55:13",
      0.00669472,
    ),
  ],
});
