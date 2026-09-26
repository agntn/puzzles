import {
  answer,
  claim,
  compressed,
  funding,
  hex,
  official,
  p2pkh,
  party,
} from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

/** Where the public key, the hint, the winner's method and the author's confirmation were posted. */
const THREAD = "https://bitcointalk.org/index.php?topic=5538285";

/**
 * Mini-puzzle #5: a key built from four 64-bit words A, 2A, 3A and 4A, A in the lowest bits. The
 * post prints only the public key and says 0.01 BTC sits on its address; a commenter printed the
 * address, the compressed 1-address of that key. The key is the one the winner posted with the
 * method, which the author confirmed; an earlier key in the thread does not match the public key.
 */
export const mini5 = bitcoinPuzzle({
  id: "mini/5",
  address: p2pkh("1PGRtg6XjiYSB1VJAhsqLQc6hQeBqFGVPD", "f43dc8d9d15c823a5c0434f49ac8f271457c0d6d"),
  sourceUrl: THREAD,
  startedAt: "2025-04-16 08:03:44",
  status: Status.Solved,
  pubkey: compressed("03150992937967192ebcd2539e5a949689ac69e6458f9178e7251356ffe079b7f0"),
  key: hex("ce00dd1c84203ffc9a80a5d563182ffd67006e8e42101ffe3380374721080fff"),
  prize: 0.01,
  hints: [
    official(
      "03150992937967192EBCD2539E5A949689AC69E6458F9178E7251356FFE079B7F0 Hint: private key is ABCD where A (lowest bits of privkey) - some 64bit value B = 2*A C = 3*A D = 4*A",
      `${THREAD}.msg65283009#msg65283009`,
      undefined,
      {
        date: "2025-04-16",
        answer: answer(
          "Correct! We just need to use Scale = 1 | (2 << 64) | (3 << 128) | (4 << 192). There are two ways: 1. Scale G: G' = G * Scale or 2. Scale PubKey: PubKey' = PubKey / Scale. And then use kangaroo or bsgs. Very easy!",
          `${THREAD}.msg65284065#msg65284065`,
          { date: "2025-04-16" },
        ),
      },
    ),
  ],
  solvedAt: "2025-04-16 10:39:51",
  solveTime: 9367,
  transactions: [
    funding(
      "6fc1d3c404526ab9a014c6aa56caf493f330be6b723c0a567a65251bd6421aa6",
      "2025-04-16 07:42:22",
      0.01,
    ),
    claim(
      "3906084eb1907bd31d7bd3a2f673c2f7eb2f3fd5e60f88c45375370cde486379",
      "2025-04-16 10:39:51",
      0.01,
    ),
  ],
  solver: party(undefined, {
    addresses: ["bc1q978hkuljzuyg9mtr7phcsehh80577z47xdx3qh"],
  }),
});
