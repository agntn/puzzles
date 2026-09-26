import {
  answer,
  claim,
  compressed,
  funding,
  hex,
  increase,
  official,
  p2pkh,
  party,
} from "../../core/parts.ts";
import { bitcoinCashPuzzle, Status } from "../../core/puzzle.ts";

/** Where the signed message, the author's explanation and the key were posted. */
const THREAD = "https://bitcointalk.org/index.php?topic=5589799";

/**
 * Mini-puzzle #7, for puzzle #135: a message signed with that puzzle's key, whose nonce is the
 * merkle root of the genesis block. The post prints the #135 address and says the BCH sits there;
 * this is the same HASH160 in Bitcoin Cash's encoding. The author printed the key in the thread
 * after the claim.
 */
export const mini7 = bitcoinCashPuzzle({
  id: "mini/7",
  address: p2pkh(
    "bitcoincash:qqak7k98tf2tlkzar0rv2yvqlhrn9xfryctu7nrhlw",
    "3b6f58a75a54bfd85d1bc6c51180fdc732992326",
  ),
  sourceUrl: THREAD,
  startedAt: "2026-07-29 15:40:33",
  status: Status.Solved,
  pubkey: compressed("02145d2611c823a396ef6712ce0f712f09b9b4f3135e3e0aa3230fb9b6d08d1e16"),
  key: hex("0000000000000000000000000000006d9392a16883f90903d5f78da57af07eb2", 135),
  prize: 1.35,
  hints: [
    official(
      "16RGFo6hjq9ym6Pj7N5H7L1NR1rVPJyw2v Message: Thank you Satoshi Nakamoto! Signature: ICVZGMwpPuca4krotcpwEzTyJXBUQF+w25M2TLnFHzIiAKYS+4c6taNLaMM7ZChJ2oMPQXiuzsYDCeF9xZFBMZg=",
      `${THREAD}.msg66991218#msg66991218`,
      undefined,
      {
        date: "2026-07-29",
        answer: answer(
          "Ok, I will explain: to be able to calculate pk you just need to know the nonce from this signature, a hint is in the message: use bitcoin genesis block data (I used merkle root for nonce). So #135 pk is: 0000000000000000000000000000006D9392A16883F90903D5F78DA57AF07EB2",
          `${THREAD}.msg66992048#msg66992048`,
          { date: "2026-07-29" },
        ),
      },
    ),
  ],
  solvedAt: "2026-07-29 16:57:15",
  solveTime: 4602,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.135,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      1.215,
    ),
    claim(
      "1115debca78431eca06608f2cc96c91f136d3f62684c19a391264e3e1b7334f7",
      "2026-07-29 16:57:15",
      1.35,
    ),
  ],
  solver: party(undefined, {
    addresses: ["bitcoincash:qqv7seys30a4mnaeffm0yxcnvjylpvfxxgxaus70sz"],
  }),
});
