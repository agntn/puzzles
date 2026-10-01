import {
  answer,
  assets,
  digest,
  claim,
  funding,
  official,
  p2pkh,
  uncompressed,
  wif,
} from "../../core/parts.ts";
import { dogecoinPuzzle, Status } from "../../core/puzzle.ts";

/** The puzzle video, whose description lists both prizes and both addresses. */
const VIDEO = "https://www.youtube.com/watch?v=DieNZPwIUoQ";

/** The author's solution to the Dogecoin part, WIF on screen. */
const SOLUTION = "https://www.youtube.com/watch?v=-7-m60jy1RU";

/**
 * The Dogecoin half of Doge's Gambit: the same sixteen frames, read from the coloured squares a
 * piece can reach, and only those that touch a blue square. The address held 10,000 DOGE, about $50
 * when the video went up and, by the author's count, five or six thousand dollars when it was claimed.
 */
export const dogesGambitDoge = dogecoinPuzzle({
  id: "doges-gambit/doge",
  address: p2pkh("DRMqy4bGAnWpaShBFtTUoHEiBWj4HoiSfq", "ddcbc240da19c87551a9182af0c2c77e3ebd20a4"),
  sourceUrl: VIDEO,
  startedAt: "2020-12-11 22:11:10",
  status: Status.Solved,
  pubkey: uncompressed(
    "0488e79ff1f6aa637457d531c6d40c056230b8106290651054f67eb12e96a7ba35573300a4c2af9ec7597fe0dbf75f5214e34e3ae071321562d04e4766ad695766",
  ),
  key: wif("6Je1sv5tRwXLFKpnor4yef6i4k73eJu2Kw9DEnRLY3BL9jVtPq3"),
  prize: 10000,
  solvedAt: "2021-05-09 00:28:06",
  solveTime: 12795416,
  hints: [
    official(
      "This is the first time I put two puzzles in one, any feedback is appreciated!",
      VIDEO,
      undefined,
      {
        date: "2020-12-11",
        answer: answer(
          "The same board, read the other way: order the sixteen frames by their number of pink squares, keep the yellow, green, blue and red squares a piece can move to, drop those that touch no blue square, diagonals included, and read the rest by how many blue squares each one touches. Each frame gives a few characters of the Dogecoin WIF, not always the same number.",
          SOLUTION,
          { date: "2021-05-11" },
        ),
      },
    ),
  ],
  transactions: [
    funding(
      "f83597b8e239846eb61f42b0e8bcb932d2ccf206115c122e0c84bfb5d72f2503",
      "2020-12-11 21:53:40",
      10000,
    ),
    claim(
      "ccc7f365a3b212a3d8320397cec9c3aa14684f4b54e0ee037fc0f76c1ee5d372",
      "2021-05-09 00:28:06",
      9999,
    ),
  ],
  assets: assets({
    puzzle: "puzzle.jpg",
    solution: "doge-key.png",
    sourceUrl: VIDEO,
    digests: [
      digest(
        "puzzle.jpg",
        "cfb83b47d08d68c27d6526e1b0d4e4b5318eb684de68298ee9cf2e53d4b443c9",
        90980,
      ),
      digest(
        "doge-key.png",
        "30083983e7224836ef099a607f295994b2e5e2fcfdcc920de484f84ce01855b2",
        77918,
      ),
    ],
  }),
});
