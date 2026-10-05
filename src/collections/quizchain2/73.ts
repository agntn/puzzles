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

/** The block 73 thread, with the question, the funding txid, the hash digits and the TOMI hint. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/cf4rnd/10_mbtc_quizchain2_block_73/";

/** u/kimi_tousan's comment with the whole winning string, the only place the solution was published. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/cf4rnd/comment/euacll6/";

/** Quizchain2 block 73: `carbon budget`, the problem Grycoin is meant to solve, with `Grycoin solution` as the TOMI field. */
export const quizchain2Block73 = puzzle({
  id: "quizchain2/73",
  chain: "bitcoin",
  address: "1dG3cAWeKx67hnTVvpDCpUFwPiuqCn68X",
  sourceUrl: THREAD,
  startedAt: "2019-07-18 23:08:01",
  status: Status.Solved,
  pubkey: compressed("020bbe6e7ac96d508da94f72125ec26d64508410b111ed4c829be19b8f12ed3346"),
  key: wif("L1BPBMCAZxDVnHS2VqaTheGWtFXzA7pegWnA33k695Zy885dQmLe")
    .entropy(
      "f13802b5a4dcc607f7dd33d333af51e4",
      source(PLAYER_COMMENT, "MD5 of two words, TOMI and two words"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", PLAYER_COMMENT)],
  prize: 0.01,
  hints: [
    official("Question: This is the problem Grycoin is supposed to solve.", THREAD, undefined, {
      answer: answer(
        "It was obvious this was something about climate change I just did not expect the TOMI to be so obvious too",
        PLAYER_COMMENT,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("Solution: carbon budget TOMI Grycoin solution", PLAYER_COMMENT),
    }),
    official("First three digits of MD5 hash are f13 (copypasted).", THREAD),
    official("So here goes partial hash for solution only, 2 digits copypasted, 0c.", THREAD),
    official(
      "Update (hint): TOMI field is two words, with (checking very careful now) Grycoin not grycoin the correct way to write it as one of them.",
      THREAD,
    ),
  ],
  solvedAt: "2019-07-20 08:19:28",
  solveTime: 119_487,
  transactions: [
    funding(
      "e7f8fef0258cd5e76bec5846257cd9129d39cd5324765099c392a93950b8666e",
      "2019-07-18 23:08:01",
      0.01,
    ),
    claim(
      "3b38dcbcf82c81759e6b7762012c43b6126a1e1e34e007d333692235b4d94df5",
      "2019-07-20 08:19:28",
      0.00983027,
    ),
  ],
});
