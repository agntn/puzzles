import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The block 40 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c19m8f/7_mbtc_quizchain2_block_40/";

/** Quizchain2 block 40: `hodl`, the famous typo, with `hold` in the TOMI field. */
export const quizchain2Block40 = puzzle({
  id: "quizchain2/40",
  chain: "bitcoin",
  address: "1NDV1sWQaE6NzpvejaGHjoyg1ntNLtxzXP",
  sourceUrl: THREAD,
  startedAt: "2019-06-16 08:13:56",
  status: Status.Solved,
  pubkey: compressed("03926cfee34d42cbf1ef2105e8b1af002476781ee60259648595c183c8fc4ba323"),
  key: wif("L41cFG1neExHf3EP74PttuQ3yeQEwtCfxUoqjYkcFXVxSKooWWYK")
    .entropy("5a95ded197b67a6a169fbbb326932480", source(THREAD, "MD5 of the word, TOMI and a word"))
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: Famous mistake.", THREAD, undefined, {
      answer: answer("Solultion was hodl, TOMI field was hold.", THREAD),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD),
    official('Solution format is one word, all in lower case like "word".', THREAD),
    official(
      'TOMI field is the same as solution format, one word all in lower case, like "word".',
      THREAD,
    ),
    official("FIrst three digits of MD5 hash are 5a9.", THREAD),
  ],
  solvedAt: "2019-06-16 13:52:40",
  solveTime: 20_324,
  transactions: [
    funding(
      "28619e939eb640e2c350bc8acf4fdfc9c2fb58991f5a2f33d7aadbcbda6dcdb2",
      "2019-06-16 08:13:56",
      0.007,
    ),
    claim(
      "0ef17caeb3457577936f0ea34fa1fc0a048df26b1fba3a55d38506be7a8934fe",
      "2019-06-16 13:52:40",
      0.006,
    ),
  ],
});
