import { puzzle } from "../../core/puzzle.ts";
import { funding } from "../../core/parts.ts";

/** Puzzle `weave/11`. */
export const weave11 = puzzle({
  id: "weave/11",
  chain: "ethereum",
  address: "0xff2142e98e09b5344994f9beb9c56c95506b9f17",
  sourceUrl: "https://arweave.net/CzITHnEIlkQw9SbaX5futCzFrKk1qe_NwvWnIBmP2fY",
  startedAt: "2020-04-14 09:10:29",
  prize: 1,
  transactions: [
    funding(
      "0x0d4738abf9d5c03c196eee4953feeb56ff06c385fa322bc9c76e105da38d7563",
      "2020-04-14 09:10:29",
      1,
    ),
  ],
});
