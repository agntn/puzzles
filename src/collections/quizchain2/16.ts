import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The block 16 thread, with the question, the funding txid, the hash digits and the hint. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/bsccmw/7_mbtc_quizchain_2_block_16/";

/** u/puzzleponky's comment with the whole winning string and the vanity address. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/bsccmw/comment/eopmxex/";

/** Quizchain2 block 16: `ELiZABETH` and the rest of its 2012 vanity address, TOMI between. */
export const quizchain2Block16 = puzzle({
  id: "quizchain2/16",
  chain: "bitcoin",
  address: "1JVXDyfoZMYaKPu2XYZpWVk9K8bGbFQLTU",
  sourceUrl: THREAD,
  startedAt: "2019-05-24 01:49:56",
  status: Status.Solved,
  pubkey: compressed("02a1fe675edae6db2bebfefdc8998877a33ff7f3d7cd413b96cfee166d89b929d3"),
  key: wif("L5FzJxW7EFxBvxa3gZa2AtVwdPriP3UYcCH7WRuzVWdjdUbA5AMF")
    .entropy(
      "bbc3a6f7d13ab0fc07863e6ba04f6636",
      source(THREAD, "MD5 of the name, TOMI and nine characters"),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: Difficult name found in 2012.", THREAD, undefined, {
      answer: answer(
        "Solution was: ELiZABETH TOMI dzGTuQeg2 from a vanity address 1ELiZABETHdzGTuQeg2RnCcWBMVo3ySfTz that was a record 9 characters long found in 2012.",
        PLAYER_COMMENT,
      ),
    }),
    official("Format: [solution] TOMI [TOMI]", THREAD),
    official(
      "Capitalization of solution will be obvious if you find the correct method. TOMI will be a string of 9 random characters, also obvious from the method.",
      THREAD,
      undefined,
      {
        answer: answer(
          "(the 9 characters for the TOMI are the random characters after ELiZABETH)",
          PLAYER_COMMENT,
        ),
      },
    ),
    official("First three characters of MD5 hash are bbc.", THREAD),
    official("Update: By popular demand, first digit of MD5 hash of solution only is 3.", THREAD),
    official("9 random characters TOMI field and 9 characters name.", THREAD),
  ],
  solvedAt: "2019-05-25 07:23:02",
  solveTime: 106_386,
  transactions: [
    funding(
      "66fbf3b11305dcfe2deababb186422ae6ec5624454ce7c15b8220a50a61477ba",
      "2019-05-24 01:49:56",
      0.007,
    ),
    claim(
      "c003b65e1744ae13fd44026c15f3a26c2912a5ccb59931571acdb69d1ed5f668",
      "2019-05-25 07:23:02",
      0.00656992,
    ),
  ],
});
