import { arweavePuzzle, Status } from "../../core/puzzle.ts";
import { claim, fact, funding, party, standard } from "../../core/parts.ts";

/** Puzzle `arweave/weave8`. */
export const arweavePuzzleWeave8 = arweavePuzzle({
  id: "arweave/weave8",
  address: standard("ayJQH1S6Fi52OEokLVi2tl5kr_y39LSfhJcNV0z9Ny4"),
  sourceUrl:
    "https://mwgauw2twixdxh3fm6mywx7tvuxo442xtckttdbhpbctxz3em5fq.arweave.net/ZYwKW1OyLjufZWeZi1_zrS7uc1eYlTmMJ3hFO-dkZ0s",
  startedAt: "2020-01-08 11:19:09",
  status: Status.Claimed,
  prize: 400,
  solvedAt: "2020-03-07 05:57:26",
  solveTime: 5078297,
  transactions: [
    funding("QC2WG7BkxHLnlREz6DsdoFm4wlmmSnwXYAPn9NWEvF4", "2020-01-08 11:19:09", 400),
    claim("IyDIQkSbPFAe7Iunxr6A7Hwzt0QTbX6_NV8Vrn7L_5M", "2020-03-07 05:57:26", 399.99999394),
  ],
  solver: party("lia", {
    key: "lia",
    about: "Handle credited with Arweave Puzzle 8, three riddles about famous deaths.",
    facts: [
      fact(
        "ZorenX's write-up of Puzzle 08 names lia as the solver of the three death riddles: Rasputin, Wilhelm, Alekhine.",
        "https://medium.com/@zorenskye/arweave-puzzle-series-puzzle-08-solved-34a2b32fb308",
      ),
    ],
  }),
});
