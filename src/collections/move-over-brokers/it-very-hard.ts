import { funding } from "../../core/parts.ts";
import { puzzle } from "../../core/puzzle.ts";

/** The author's retrospective, with the four Italian addresses and their difficulty. */
const ARTICLE = "https://kf106.medium.com/everyone-loves-a-treasure-hunt-93885ae8d80a";

/** The very hard Italian lot, still holding its 200,000 sats. */
export const moveOverBrokersItVeryHard = puzzle({
  id: "move-over-brokers/it-very-hard",
  chain: "bitcoin",
  address: "19kkawFcg2U2s6vq368MXD7FJU9JZvRrjA",
  sourceUrl: ARTICLE,
  startedAt: "2021-09-11 09:28:09",
  prize: 0.002,
  transactions: [
    funding(
      "42919c00a64661e20b8af5719c64d58339e6e492ad21f07f4d38548768cbb23e",
      "2021-09-11 09:28:09",
      0.002,
    ),
  ],
});
