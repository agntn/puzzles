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

/** The block 68 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/cd2qqx/7_mbtc_quizchain2_block_68/";

/** AoiNakamoto's reply with the partial hashes of the solution and the TOMI field. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/Grycoin/comments/cd2qqx/comment/ets7qbx/";

/** u/LiaVl's comment with the solution. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/cd2qqx/comment/etsk4r0/";

/** Quizchain2 block 68: `Seveneves`, a book title that reads seven both ways, with `palindrome` as the TOMI field. */
export const quizchain2Block68 = puzzle({
  id: "quizchain2/68",
  chain: "bitcoin",
  address: "1LQsUnUBDwEqAUwsPdA5LVyGNignRpSVBm",
  sourceUrl: THREAD,
  startedAt: "2019-07-14 09:57:41",
  status: Status.Solved,
  pubkey: compressed("021575dc1bfdaae34188dcc36f5a3755059f622e430f74c94621a210ab136c0155"),
  key: wif("KzSsEA9wB3fP2dEFVDv8F4UWEDGC1dcKuMYc4m22L5ibDkEBuKB4")
    .entropy(
      "14ad1f06f0103e94a035e265de04f150",
      source(THREAD, "MD5 of the title, TOMI and a word"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official(
      'Question: Book title from a number. No, "Second" is not the answer.',
      THREAD,
      undefined,
      {
        answer: answer('Solution was "Seveneves", TOMI field was "palindrome".', THREAD),
      },
    ),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("Seveneves TOMI palindrome", PLAYER_COMMENT),
    }),
    official("TOMI format is one word in all lowercase.", THREAD),
    official("FIrst three digits of MD5 hash are 14a.", THREAD),
    official("Solution only 03, TOMI field only 07.", AUTHOR_COMMENT),
  ],
  solvedAt: "2019-07-14 23:38:33",
  solveTime: 49252,
  transactions: [
    funding(
      "de95c5adbacd2c67a4ce1006ea1656239542a2abe6820e7a9fbcb7bb40e9d726",
      "2019-07-14 09:57:41",
      0.007,
    ),
    claim(
      "20411c1386fd6297ef5421f9a0222c61b00ac8b88861a17df92ea7636acba875",
      "2019-07-14 23:38:33",
      0.0069065,
    ),
  ],
});
