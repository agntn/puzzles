import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Where the format, the funding txid and the author's account of the solution of block 2 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bnj24w/77_mbtc_quizchain2_block_2/";

/** The author's reply of May 12, 2019 about the missing question. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bnj24w/comment/en66xg8/";

/** u/Quantris's walkthrough with the master string, both hashes and the block key. */
const WALKTHROUGH = "https://www.reddit.com/r/bitcoinpuzzles/comments/bnj24w/comment/en6e73r/";

/**
 * Quizchain2 block 2: the second key of the wallet the Wattpad chapter's master string
 * `"BaSCifCatfAaa1i"Metamon` seeds through MD5, used whole as the solution and hashed with MD5
 * again into BIP39 entropy, for 77 mBTC. A player printed both hashes and the block key.
 */
export const quizchain2Block2 = puzzle({
  id: "quizchain2/2",
  chain: "bitcoin",
  address: "13qUHVzMYAneyyBGYvEey4SHy2iMSz3Jzh",
  sourceUrl: THREAD,
  startedAt: "2019-05-12 00:29:20",
  status: Status.Solved,
  pubkey: compressed("03f2632ecf5c36d83e97c02db9b2140336580bc43a6478c1625b9522fce483faf1"),
  key: wif("KzFB7hBGmLBqm8nqVCVLBmgyd1NxnoJXZUhE377QL4T2iy5rw4Wz").entropy(
    "7b44cc11c866ab85b7078c43ad6795e1",
    source(WALKTHROUGH, "MD5 of the second key the Wattpad master string derives"),
  ),
  prize: 0.077,
  hints: [
    official(
      "It has no question right now, which is why it is difficult.",
      AUTHOR_COMMENT,
      undefined,
      {
        answer: answer(
          "This was just using the puzzle string in the latest Wattpad chapter on quizchain as a password manager in exactly the way it was described there and then pick the second private key under that puzzle string.",
          THREAD,
        ),
      },
    ),
    official("Format: [solution]", THREAD, undefined, {
      answer: answer("L5Z66qPmUkTAsWQywjRNHDxHrX6J1X1SQedp6V8QsbaXR7rGd6ex", WALKTHROUGH),
    }),
    official(
      "This solution does not need a TOMI field. And it also does not need a link, since it is sufficiently strong as a password to make brute forcing it impossible on its own.",
      THREAD,
    ),
    official("Update: First three digits of MD5 hash are 7b4.", THREAD),
  ],
  solvedAt: "2019-05-12 02:22:37",
  solveTime: 6797,
  transactions: [
    funding(
      "c5e59f1e8b7218c76a9029bb16c0085028095ac3527ebc3e1f964b1d12d87f24",
      "2019-05-12 00:29:20",
      0.077,
    ),
    claim(
      "c1e362deff1954846810ffa15044f49ee94a382e6a2075721cec198a6260d6f9",
      "2019-05-12 02:22:37",
      0.0769,
    ),
  ],
});
