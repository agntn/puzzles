import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The block 30 thread, with the question, the funding txid, the hints and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/bx97d0/7_mbtc_quizchain2_block_30/";

/** u/kimi_tousan's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/bx97d0/comment/eqg0k0b/";

/** Quizchain2 block 30: `EU IQ KO`, read one place off an Atbash foldover. */
export const quizchain2Block30 = puzzle({
  id: "quizchain2/30",
  chain: "bitcoin",
  address: "123eggbD9tm39Qv1YXLcBt4vCtNcHFHDRm",
  sourceUrl: THREAD,
  startedAt: "2019-06-05 22:49:59",
  status: Status.Solved,
  pubkey: compressed("028a2733a6e0dacff467144a11403ff5e9a936af840761d41dedfa75794e8ae836"),
  key: wif("Kwk33rsM9GnzoNePzxX1M4EstCVPgvZ229j5HBbLtjUoULdqjCZ5")
    .entropy(
      "086f597ff6158313c5a0b7fa4cddc0c1",
      source(THREAD, "MD5 of the three pairs, TOMI and two words"),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: AY", THREAD, undefined, {
      answer: answer('Solution was "EU IQ KO" and TOMI field was "Atbash foldover".', THREAD),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("Solution: EU IQ KO TOMI Atbash foldover", PLAYER_COMMENT),
    }),
    official("Solution format is three sets of two capital letters.", THREAD),
    official("FIrst three digits of MD5 hash are 086.", THREAD),
    official("FIrst digit of solution only MD5 hash is b.", THREAD),
    official("FIrst digit of TOMI field only MD5 hash is 4.", THREAD),
    official(
      "The format for the TOMI field is [Word1] [word2]. Word1 starts with a capital letter, word2 is all lower case. There is one space between the two words.",
      THREAD,
    ),
    official("First word of TOMI field is Atbash.", THREAD),
  ],
  solvedAt: "2019-06-08 20:37:36",
  solveTime: 251_257,
  transactions: [
    funding(
      "ea8cc06a7b115c1e5ec85d1cbfb4ff0a39d3cfa23e50526f4fb7c0155247ac47",
      "2019-06-05 22:49:59",
      0.007,
    ),
    claim(
      "5309e0cdab0e5ef997b86a78836e83a194d4d0822a0f5f7b175032b48945e27e",
      "2019-06-08 20:37:36",
      0.00683219,
    ),
  ],
});
