import {
  answer,
  assets,
  claim,
  digest,
  funding,
  hex,
  official,
  technique,
  uncompressed,
} from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The puzzle video, whose description lists both prizes and both addresses. */
const VIDEO = "https://www.youtube.com/watch?v=DieNZPwIUoQ";

/** The author's solution to the Bomb Token and Ether part, key on screen. */
const SOLUTION = "https://www.youtube.com/watch?v=d-29rBeQXV4";

/**
 * The Bomb Token and Ether half of Doge's Gambit: sixteen frames of a chess board, four hex digits
 * of the key in each, read from the coloured squares no piece can reach. The address held 0.01 ETH
 * and 49 BOMB; both left it on April 23, 2021, the BOMB ten minutes before the ETH.
 */
export const dogesGambitEth = puzzle({
  id: "doges-gambit/eth",
  chain: "ethereum",
  address: "0x7777F6974BA9Ba3Bcfe75D2Aa52db8cE633e592F",
  sourceUrl: VIDEO,
  startedAt: "2020-12-11 22:11:10",
  status: Status.Solved,
  pubkey: uncompressed(
    "047646f5a4dbb6fa9cc47f1c446a63a95b9a7e8b7f14336ed3e573ee8277d54bb7b2d99d67a03a00f0d6543eac3faccd938e06b17aba5a139ec86cda70a0477bce",
  ),
  key: hex("78502de89b8db1c4af2392e34b78d47865c93b923a6eaac3671bdeafa400c206"),
  techniques: [technique("steganography", VIDEO)],
  prize: 0.01,
  solvedAt: "2021-04-23 14:32:06",
  solveTime: 11463656,
  hints: [
    official(
      "This is the first time I put two puzzles in one, any feedback is appreciated!",
      VIDEO,
      undefined,
      {
        date: "2020-12-11",
        answer: answer(
          "The board is a chess board with coins for pieces: Doge knights, Ether rooks, Bomb Token bishops and spirograph queens. Order the sixteen frames by the sum of the digits on white squares, 1 to 16. In each frame keep the yellow, green, blue and red squares no piece can move to, two of each colour, add each pair modulo 16 and read the four sums in star order, yellow, green, blue, red. Four hex digits per frame give the Ether key.",
          SOLUTION,
          { date: "2021-05-11" },
        ),
      },
    ),
  ],
  transactions: [
    funding(
      "0xbdbaad334db80acb7d6ea47a266eb0e1b5c21faddda71e8d2875ea0478f1145c",
      "2020-12-11 21:43:59",
      0.01,
    ),
    claim(
      "0x773bee8947b9d981b678f07ba819fee41e0ef76b718804934f0ab9fe59b7d9dc",
      "2021-04-23 14:32:06",
      0,
    ),
    claim(
      "0xd4d0179ed4af5fe17953c44bc1b583d5b9f8ef7579e45ddddeee2f06de7bf731",
      "2021-04-23 14:42:14",
      0.003308173,
    ),
  ],
  assets: assets({
    puzzle: "puzzle.jpg",
    solution: "eth-key.png",
    sourceUrl: VIDEO,
    digests: [
      digest(
        "puzzle.jpg",
        "cfb83b47d08d68c27d6526e1b0d4e4b5318eb684de68298ee9cf2e53d4b443c9",
        90980,
      ),
      digest(
        "eth-key.png",
        "06479cecbe1757b5cbf62309bc0d9e8c49002151eb300124c9fd978124ccbc7a",
        78694,
      ),
    ],
  }),
});
