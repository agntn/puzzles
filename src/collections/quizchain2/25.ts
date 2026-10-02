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

/** The block 25 thread, with the question, the funding txid, the hints and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/bvgsn7/7_mbtc_quizchain2_block_25/";

/** u/Randomiser's comment with the whole winning string. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/bvgsn7/comment/epsh5d9/";

/** Quizchain2 block 25: `77 + 25`, since block 25 of the second run is block 102 overall. */
export const quizchain2Block25 = puzzle({
  id: "quizchain2/25",
  chain: "bitcoin",
  address: "12pGDovmd3dC58NYvuF7bd3huMJbutEZ1J",
  sourceUrl: THREAD,
  startedAt: "2019-06-01 02:23:30",
  status: Status.Solved,
  pubkey: compressed("020547a8fce00bdea1f7a61f174bff002b60d490bc33e482197aa2f2fb95aaf962"),
  key: wif("L5FJ3bs7o7MktG9BazTiaJ87vvKoDXuTyesH4PeEHfF4Eie2Ur8E")
    .entropy(
      "45763700ded083bf9d46f148dcd6d178",
      source(THREAD, "MD5 of the sum, TOMI and four words"),
    )
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.007,
  hints: [
    official(
      "Question: We use three Fibonacci numbers. One, zero, and two. What does this mean?",
      THREAD,
      undefined,
      {
        answer: answer(
          "The Fibonacci stuff was a hoax, if you avoided falling for that, it was just a matter of noting that this block 25 is actually already block 102 and finding the TOMI field.",
          THREAD,
        ),
      },
    ),
    official("Format: [solution] TOMI [TOMI]", THREAD, undefined, {
      answer: answer("77 + 25 TOMI total number of blocks", PLAYER_COMMENT),
    }),
    official("First three digits of MD5 hash are 457.", THREAD),
    official("First digit of solution only MD5 hash is a.", THREAD),
    official("FIrst digit of TOMI field only MD5 hash is 4.", THREAD),
    official("Not about Fibonacci. First word of TOMI field is total.", THREAD),
  ],
  solvedAt: "2019-06-02 04:30:15",
  solveTime: 94_005,
  transactions: [
    funding(
      "af41bfa7ffa60febb31ccaef88e0953fed581cbf42b8bc1219cf882908ec1efd",
      "2019-06-01 02:23:30",
      0.007,
    ),
    claim(
      "0479188cce386d7830e68c60f330fd92c07e5747a3cc3284ff76571b6e1072a7",
      "2019-06-02 04:30:15",
      0.0064505,
    ),
  ],
});
