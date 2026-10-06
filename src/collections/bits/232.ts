import { puzzle, Status } from "../../core/puzzle.ts";
import { bits, compressed, funding, sweep } from "../../core/parts.ts";

/** Puzzle `bits/232`. */
export const bits232 = puzzle({
  id: "bits/232",
  chain: "bitcoin",
  address: "1MEEjd99pkEyCdiqVSCa8Jqjaun7fsEXaG",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Swept,
  pubkey: compressed("03d9dd7c018dcf2a57a4d6c4299983c631ff8ab32eb72b57cfcf25be5366a9ed21"),
  key: bits(232),
  prize: 0.232,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.232,
    ),
    sweep(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.232,
    ),
  ],
});
