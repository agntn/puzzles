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

/** Where the question, the funding txid, the hints and the solution of block 10 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bqerv5/7_mbtc_quizchain2_block_10/";

/** u/puzzleponky's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bqerv5/comment/eobvhi6/";

/**
 * Quizchain2 block 10: `ghost`, the third word from the end of the block 9 mnemonic, then TOMI and
 * three words, hashed with MD5 into BIP39 entropy. The question about words ending in "gry" was
 * a decoy. No source printed the hash or the key.
 */
export const quizchain2Block10 = puzzle({
  id: "quizchain2/10",
  chain: "bitcoin",
  address: "1BaxjCt2ejWghHGf41yic1mLmbFSnikAjP",
  sourceUrl: THREAD,
  startedAt: "2019-05-18 04:25:51",
  status: Status.Solved,
  pubkey: compressed("02a67ab5cf0ac124576263b769b90461b6c9692f3e5427cab59a72032254932ef6"),
  key: wif("L4AuzcFxev8S7quRsoHfhB8dXXtgfuWR6Y7EcxtfE3RCFF9rVWWY")
    .entropy(
      "a5b7b7b212835bbeb75e9d14c5355e07",
      source(THREAD, "MD5 of the word, TOMI and three words"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official(
      'Question: There are three common words in the English language ending in "gry". Angry, hungry, and one other word. What is the third word?',
      THREAD,
      undefined,
      {
        answer: answer(
          "Solution was ghost, method was to look in the mnemonic of the previous block, which was also used in block 6 of this second run. TOMI field was previous block mnemonic.",
          THREAD,
        ),
      },
    ),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("ghost TOMI previous block mnemonic", PLAYER_COMMENT),
    }),
    official("Format for TOMI field is [word1 word2 word3], all in lower case letters.", THREAD),
    official(
      "Would be solved at sight except for the slight extra twist that I included.",
      THREAD,
      undefined,
      {
        answer: answer(
          "The twist was not taking the obvious choice (third word from the beginning), but the third word from the end of the list.",
          THREAD,
        ),
      },
    ),
    official("First three digits of MD5 hash are a5b.", THREAD),
    official(
      'Hint 1 (after 24 hours): Method for this block was used in previous blocks (once already also in second run), look at "Complete Quizchain" chapter in Wattpad story for inspiration.',
      THREAD,
    ),
    official(
      "Hint 2 (after 48 hours): Method for this block was the same as in block 6, go back to previous block to look up solution.",
      THREAD,
    ),
  ],
  solvedAt: "2019-05-21 14:22:26",
  solveTime: 294_995,
  transactions: [
    funding(
      "c1f1d772594ee1aaca6cf17ee48beb5b2ada35c3c1601482a69f46e94c4dd1ac",
      "2019-05-18 04:25:51",
      0.007,
    ),
    claim(
      "fb0eaa30edb6cd98913ef823aeaf911a7f266b21d8fd261ae418afdaeff8f7b4",
      "2019-05-21 14:22:26",
      0.00687654,
    ),
  ],
});
