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

/** The block 49 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c54umz/7_mbtc_quizchain2_block_49/";

/** u/puzzleponky's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/c54umz/comment/erztw4n/";

/** Quizchain2 block 49: `Don't be evil`, another slogan, with `Google slogan` printed in the format by mistake. */
export const quizchain2Block49 = puzzle({
  id: "quizchain2/49",
  chain: "bitcoin",
  address: "1JNoG4tCkwqH49FWa2vGRzMyd9MMDBoeUd",
  sourceUrl: THREAD,
  startedAt: "2019-06-25 05:16:55",
  status: Status.Solved,
  pubkey: compressed("03b8fbb362216c3a76899f28ce5af7f7d9e7f30afdbe61d9f2e925ff4768bd7675"),
  key: wif("L1w1EzaQwHoE3rR9xhVQ3Wutamraai25D7U82Z4LH8c6cRWXUFqT")
    .entropy(
      "4f1cfb8b91afad29e9b5490c6318e14b",
      source(THREAD, "MD5 of the three words, TOMI and two words"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official("Question: Don't", THREAD, undefined, {
      answer: answer('Solution was "Don\'t be evil".', THREAD),
    }),
    official("Format: [solution] TOMI Google slogan", THREAD, undefined, {
      answer: answer("answer was of course: Don't be evil TOMI Google slogan", PLAYER_COMMENT),
    }),
    official("First three digits of MD5 hash are 4f1.", THREAD),
    official("This block uses a method similar to the previous one.", THREAD),
  ],
  solvedAt: "2019-06-25 08:17:27",
  solveTime: 10_832,
  transactions: [
    funding(
      "bc25a89a0575d9f19f6953b5db3eafd7758111a03bcbbe108ba8c7668e824ba3",
      "2019-06-25 05:16:55",
      0.007,
    ),
    claim(
      "a924d7721cc4f56d2ddcf0c177d16853a63069ac213b78ffec0ca8ae0e6287bf",
      "2019-06-25 08:17:27",
      0.00681491,
    ),
  ],
});
