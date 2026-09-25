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

/** Where the clues, the funding txid and the solution of block 7 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/baok2v/medium_77_mbtc_quizchain_block_lucky_7/";

/** Where the author printed the last three characters of the block 6 key that block 7 appends. */
const BLOCK_6 =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bafyoo/hard_7_mbtc_quizchain_block_6/";

/**
 * Quizchain block 7, the lucky one with a 77 mBTC prize: four words and a period, with the last
 * three characters of the block 6 key appended, hashed with SHA-256 into BIP39 entropy. The post
 * names the funding transaction, not the address, released its clue in three phases, and after the
 * claim edited the solution into the post. Neither the hash nor the key was ever printed: the
 * record runs the post's recipe on the published solution, and the key it derives matches the
 * public key the claim revealed.
 */
export const quizchainBlock7 = bitcoinPuzzle({
  id: "quizchain/7",
  address: p2pkh("1J7t9vhfXchLM58Ms2U4WrfRHmLU75hYZV", "bbc755d0b1c03ca82334d1188a5bba5aa2e2ad67"),
  sourceUrl: THREAD,
  startedAt: "2019-04-08 02:50:59",
  status: Status.Solved,
  pubkey: compressed("02f74aee052f5adb58c5715d033b9b4d69d95e21a067f4b0e8e34a1acb0dd5141a"),
  key: wif("L14NcSSbGBZBs5i1FrasxWWBgUWEx6SmBaujCYF4gMZfxCZP6LbF")
    .entropy(
      "2c42845a53de06199d986dc725c87877cfe210b75fce8aeabcdeea583bf2a435",
      source(
        THREAD,
        "SHA-256 of the author's solution with the last three characters of the block 6 key appended",
      ),
    )
    .derived(),
  prize: 0.077,
  hints: [
    official(
      "Of course as always append also the last three digits of the private key for block 6.",
      THREAD,
      undefined,
      {
        answer: answer(
          "Here are the last three digits of the private key, so I can move on to block 7. They are MQz.",
          BLOCK_6,
        ),
      },
    ),
    official("Four words and a period at the end.", THREAD),
    official("Second clue. My handle name is Aoi Nakamoto.", THREAD),
    official("Third and last clue: Why did I choose that handle name?", THREAD, undefined, {
      answer: answer(
        'Someone has claimed the prize. Solution was "Satoshi without the consonants." Congrats to the winner of this special block.',
        THREAD,
      ),
    }),
  ],
  solvedAt: "2019-04-08 17:21:46",
  solveTime: 52_247,
  transactions: [
    funding(
      "a5b21d650ca89744226179c88f847373a51fdd121e7583ce81693799381d5502",
      "2019-04-08 02:50:59",
      0.077,
    ),
    claim(
      "0d51c720e76f4cdcd4f816317d7eec859891b6d419580c1c8009b310647bfc03",
      "2019-04-08 17:21:46",
      0.07699,
    ),
  ],
});
