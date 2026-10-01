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

/** The block 14 thread, with the question, the funding txid, the hints and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/bs06rg/77_mbtc_quizchain2_block_14/";

/** u/puzzleponky's comment with the solution and how it was found. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/bs06rg/comment/eoprx9p/";

/** Quizchain2 block 14: the genesis address cut to `A1zP1eP7DivfNa`, for 77 mBTC. */
export const quizchain2Block14 = bitcoinPuzzle({
  id: "quizchain2/14",
  address: p2pkh("1JkKLAKSQ6BmC26DZbTgcpqBNUf91aeojd", "c2ab537ac168ebf8736e74597956a7cebb508a95"),
  sourceUrl: THREAD,
  startedAt: "2019-05-21 23:54:35",
  status: Status.Solved,
  pubkey: compressed("02a4780dd6045c8e96211360c19fb5d95810480638fbee20975b972a915dd0b54d"),
  key: wif("L4QU6j4wVq6pgpnYiUboCCETaGGJVdjp1JYRJtDAqg42FVoV5WG8")
    .entropy("5f844f86af9217915e3764d92974b696", source(THREAD, "MD5 of the fourteen characters"))
    .derived(),
  prize: 0.077,
  hints: [
    official("Question: 14 from 7.", THREAD, undefined, {
      answer: answer(
        "As indicated by the winner, who is totally not me, solution was the first and the last seven digits of the genesis block address, not counting the prefix 1. A1zP1eP7DivfNa.",
        THREAD,
      ),
    }),
    official("Format: [solution]", THREAD, undefined, {
      answer: answer("Solution was A1zP1eP7DivfNa.", PLAYER_COMMENT),
    }),
    official(
      'Hint: The solution is not something as simple as "2", which is already apparent from the lack of TOMI field.',
      THREAD,
    ),
    official("First three digits of MP5 hash are 5f8.", THREAD),
    official('Update: Correct is "MD5" hash.', THREAD),
    official(
      "Hint for this was already available at the time of posting at the Wattpad story.",
      THREAD,
    ),
    official("Red seven.", THREAD),
  ],
  solvedAt: "2019-05-25 08:40:22",
  solveTime: 290_747,
  transactions: [
    funding(
      "377e5148989442048659eaa3dd6bcd7423e7f8ba3cd41433bc66f108e50f1e01",
      "2019-05-21 23:54:35",
      0.077,
    ),
    claim(
      "25ca033024725ef7742c99565a0f58484f213564ae16ae3c8dc8aa2990a8c603",
      "2019-05-25 08:40:22",
      0.07656992,
    ),
  ],
});
