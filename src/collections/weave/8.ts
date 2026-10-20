import { puzzle, Status } from "../../core/puzzle.ts";
import { claim, fact, funding, keyfile, party } from "../../core/parts.ts";

/** The prize wallet's keyfile, sealed in the page's `var msg`. */
const KEYFILE =
  "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";

/** The three names from ZorenX's write-up, joined the way the page joins its blanks. */
const ANSWER = "RasputinWilhelmAlekhine";

/** Puzzle `weave/8`. */
export const weave8 = puzzle({
  id: "weave/8",
  chain: "arweave",
  address: "ayJQH1S6Fi52OEokLVi2tl5kr_y39LSfhJcNV0z9Ny4",
  sourceUrl:
    "https://mwgauw2twixdxh3fm6mywx7tvuxo442xtckttdbhpbctxz3em5fq.arweave.net/ZYwKW1OyLjufZWeZi1_zrS7uc1eYlTmMJ3hFO-dkZ0s",
  startedAt: "2020-01-08 11:19:09",
  status: Status.Claimed,
  key: keyfile(KEYFILE, { passphrase: ANSWER }),
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
