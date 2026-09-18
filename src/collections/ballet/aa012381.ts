import { bitcoinPuzzle } from "../../core/puzzle.ts";
import { assets, funding, increase, p2pkh, passphrase } from "../../core/parts.ts";

/** Puzzle `ballet/AA012381`. */
export const balletPuzzleAA012381 = bitcoinPuzzle({
  id: "ballet/AA012381",
  address: p2pkh("1QGtbKxx6FKDD66LwnrzHCAHmyZ7mDHqC4", "ff4c32fbedc3e87a8f206d9b231baa2ef3781c9e"),
  sourceUrl: "https://x.com/bobbyclee/status/1289004702122643456",
  startedAt: "2020-07-24 05:46:12",
  key: passphrase("594Y-L2RW-4ME7-2XVX-9B41"),
  prize: 1.00003877,
  transactions: [
    funding(
      "3771eac625e0ac4eb60bab31ea73424634b068ac4e724af0cd87330311837933",
      "2020-07-24 05:46:12",
      1,
    ),
    increase(
      "9454b3f4ff4e6751763d9e99e710ddccef0cd916e51f661e1ffbc5fe17808df9",
      "2022-01-30 13:11:20",
      0.00001,
    ),
    increase(
      "864ce8c51ea055ad0cfbc93695efeacf136d31441199cdec5003ab3e33c3eb7c",
      "2024-05-17 04:06:41",
      0.00002877,
    ),
  ],
  assets: assets({
    puzzle: "AA012381/puzzle.jpg",
    sourceUrl: "https://x.com/bobbyclee/status/1289004702122643456",
  }),
});
