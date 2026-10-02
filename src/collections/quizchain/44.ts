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

/** Where the question and the funding txid of block 44 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bddkxb/7_mbtc_quizchain_block_44/";

/** The author's comment of April 15, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bddkxb/comment/ekxhgof/";

/** The author's comment of April 19, 2019 in the thread. */
const AUTHOR_COMMENT_2 = "https://www.reddit.com/r/bitcoinpuzzles/comments/bddkxb/comment/el8tmu9/";

/** The author's comment of May 8, 2019 in the thread. */
const AUTHOR_COMMENT_3 = "https://www.reddit.com/r/bitcoinpuzzles/comments/bddkxb/comment/emvhm0o/";

/**
 * Quizchain block 44: an empty solution field, BFUB and a line from the Du Hast video the post
 * links, hashed with MD5 into BIP39 entropy. The author forgot the link from block 43, so the
 * string ends with the lyric. It held for 23 and a half days, until the final hint. The author
 * later printed the WIF as the link for block 77.
 */
export const quizchainBlock44 = puzzle({
  id: "quizchain/44",
  chain: "bitcoin",
  address: "188g3aB5WFUEB7AppVRtP8Bs3rXHmABtze",
  sourceUrl: THREAD,
  startedAt: "2019-04-15 07:55:58",
  status: Status.Solved,
  pubkey: compressed("02195b57e21aa7f9379b6cb10459bd485439e3c5c2a01100eed0d57f0daca22694"),
  key: wif("L4VdZUDY2BXa7VVkjuYkmaLvi8P5qNZaARwwB9wjqkDa6Sn4JLV4").entropy(
    "60c55bd7ee69ac70e263dde2e1a38c72",
    source(THREAD, "MD5 of BFUB and the song line, with the solution field left blank and no link"),
  ),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official(
      "Question: Relax. Listen to some nice music. Wait for the idea to come. Have fun, even if the idea fails to show up.",
      THREAD,
      undefined,
      {
        answer: answer(
          "As noted in the last hint, solution was to leave the solution field blank. Since there was no link for this, the only thing to find out was the BFUB field. I chose the line in the song lyrics that made me use this video in the first place: and I have said nothing",
          THREAD,
        ),
      },
    ),
    official("Format: [solution]BFUB [BFUB] [link]", THREAD),
    official(
      "Forgot including link in hash. Use only solution and BFUB. Sorry for another mistake.",
      AUTHOR_COMMENT,
    ),
    official(
      "No space between [solution] and BFUB, but one space between BFUB and [BFUB], and no space after [BFUB], since there is no link in this one.",
      AUTHOR_COMMENT_2,
    ),
    official("and I have said leave solution field blank", AUTHOR_COMMENT_3),
  ],
  solvedAt: "2019-05-08 23:36:52",
  solveTime: 2_043_654,
  transactions: [
    funding(
      "fd1eca202459cf477c56ec716bf2cd6264a24c79716f01a54843e069396c6e92",
      "2019-04-15 07:55:58",
      0.007,
    ),
    claim(
      "53239c9352fc97dbc2427e60b598f7571314f104a368962e9b0949d0357e7bee",
      "2019-05-08 23:36:52",
      0.00676,
    ),
  ],
});
