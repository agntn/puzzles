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

/** Where the question, the funding txid and the solution of block 1 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bn5ucg/77_mbtc_quizchain2_block_1/";

/** The author's first hint, of May 12, 2019. */
const HINT_1 = "https://www.reddit.com/r/bitcoinpuzzles/comments/bn5ucg/comment/en7okiq/";

/** The author's reply of May 13, 2019 that narrows the first hint to ten blocks. */
const NARROWING = "https://www.reddit.com/r/bitcoinpuzzles/comments/bn5ucg/comment/ena1bdm/";

/** The author's second hint, of May 13, 2019. */
const HINT_2 = "https://www.reddit.com/r/bitcoinpuzzles/comments/bn5ucg/comment/endvvgh/";

/** u/Randomiser's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bn5ucg/comment/endzxka/";

/**
 * Quizchain2 block 1: a band name read from `naMe` upside down, TOMI, two words and the whole
 * block 76 key of the first run, hashed with MD5 into BIP39 entropy, for 77 mBTC. No source
 * printed the hash or the key.
 */
export const quizchain2Block1 = puzzle({
  id: "quizchain2/1",
  chain: "bitcoin",
  address: "15BbSHKqRsaH9oGk8zfTD5NZfRdXyySvMS",
  sourceUrl: THREAD,
  startedAt: "2019-05-11 00:21:12",
  status: Status.Solved,
  pubkey: compressed("03bb9076fd7548a8bb6e28887eddbecba9c70fca75ebe4a926bbee1ca3384a0834"),
  key: wif("L39LYDM5ehxxN9H6MLwQ2duJbsVucNuoHwZJAaYfLhL9RtHVHZAt")
    .entropy(
      "33c6780dcbd5927d8510d924278a0e4e",
      source(
        THREAD,
        "MD5 of the band, TOMI, two words and the whole block 76 key of the first run",
      ),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.077,
  hints: [
    official("Question: A rather famous naMe.", THREAD, undefined, {
      answer: answer(
        'As the winner has explained in comments, solution was U2 (a rather famous band name). And it was derived from the hint by reading M upside down and then W as UU, which is one step away from the solution. TOMI field was just "upside down".',
        THREAD,
      ),
    }),
    official("Format: [solution] TOMI [TOMI] [link]", THREAD, undefined, {
      answer: answer(
        "U2 TOMI upside down L2e6gPSXnq7KJBfkoD7cHGVZuhRUDARJz2Cc9JcSNLsKRZhH552F",
        PLAYER_COMMENT,
      ),
    }),
    official(
      "Use L2e6gPSXnq7KJBfkoD7cHGVZuhRUDARJz2Cc9JcSNLsKRZhH552F (private key of block 76) as a link for this block.",
      THREAD,
    ),
    official("FIrst three digits of MD5 hash are 33c.", THREAD),
    official("First digit of MD5 hash of solution only is 4.", THREAD),
    official("First digit of MD5 hash of TOMI field only is e.", THREAD),
    official("Hint: Uses method of a recent previous block.", HINT_1),
    official("One in the ten between 67 and 76.", NARROWING),
    official("Hint number 2: block 69", HINT_2),
  ],
  solvedAt: "2019-05-13 23:25:35",
  solveTime: 255_863,
  transactions: [
    funding(
      "d79b97700a9a55b346c38820c1194cda0fe73ca1b831ae63cfb2e16e446eb90b",
      "2019-05-11 00:21:12",
      0.077,
    ),
    claim(
      "c7dc06980a2986191465cc1c47612bec051693d6f8d4118ecc5f9131a84af8ca",
      "2019-05-13 23:25:35",
      0.07669453,
    ),
  ],
});
