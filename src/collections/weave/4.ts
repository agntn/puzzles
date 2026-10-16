import { puzzle, Status } from "../../core/puzzle.ts";
import {
  answer,
  claim,
  community,
  fact,
  funding,
  official,
  party,
  PartyKind,
  profile,
  type Answer,
} from "../../core/parts.ts";

/** The puzzle page with all five riddles. */
const PAGE =
  "https://ojducxyzj2dirbt7xt2jod7dkwfqolxjre6tzp63fycuq5477vta.arweave.net/ckdBXxlOhoiGf7z0lw_jVYsHLumJPTy_2y4FSHef_WY";

/** ZorenX's write-up, which answers every riddle and collects the hints. */
const WRITEUP = "https://zorenx.medium.com/arweave-puzzle-series-puzzle-04-solved-69ca109f3614";

/**
 * One riddle's answer as the write-up prints it.
 *
 * @param {string} text - The answer, on its own.
 * @returns {Answer} The answer, undated because the write-up was edited after it went up.
 */
function solved(text: string): Answer {
  return answer(text, WRITEUP);
}

/** Puzzle `weave/4`. */
export const weave4 = puzzle({
  id: "weave/4",
  chain: "arweave",
  address: "2pwE_LEzD0z6m_ENCDIta9YTBKXW9FFCURrx1yJoO7w",
  sourceUrl:
    "https://ojducxyzj2dirbt7xt2jod7dkwfqolxjre6tzp63fycuq5477vta.arweave.net/ckdBXxlOhoiGf7z0lw_jVYsHLumJPTy_2y4FSHef_WY#instructions",
  startedAt: "2019-05-25 15:39:57",
  status: Status.Claimed,
  prize: 500,
  solvedAt: "2019-11-10 10:25:40",
  solveTime: 14582743,
  transactions: [
    funding("e06EdrRKRFA-ymkfaAa1hNcBBO0yWKrf-ON9p6JmWd0", "2019-05-25 15:39:57", 250),
    funding("2UuC2087I_yNZ3Fc5bMUfjwPOAg2CEhLmQNuEDiRMjE", "2019-08-28 14:01:39", 250),
    claim("oAg07abF6rlrbZfn7P4AT05XN0VIAB_0V8j4L-0-Vt4", "2019-11-10 10:25:40", 499.99997828),
  ],
  solver: party("arpox", {
    key: "arpox",
    kind: PartyKind.Person,
    aliases: ["Arpoxy"],
    about:
      "Twitter user who solved Arweave Puzzle 4 after five and a half months and replied to the author with the answer.",
    profiles: [profile("twitter", "https://twitter.com/Arpoxy")],
    facts: [
      fact(
        "Replied to @ArweaveP with the answer string and a short I solved puzzle 4, thanking the author for the puzzles.",
        "https://x.com/Arpoxy/status/1193546824289832960",
        { date: "2019-11-10" },
      ),
      fact("ZorenX's write-up of Puzzle 04 names arpox as the solver.", WRITEUP),
    ],
  }),
  hints: [
    official(
      "India, Sophie, Lev and Martin have 100 AR altogether. Each two of them have at least 41 AR. What is the lowest possible number of AR India has?",
      PAGE,
      undefined,
      { answer: solved("12") },
    ),
    official(
      "Three droids need to choose a leader. Only two of them are suitable for the function. However, droids have no idea about politics and they will vote randomly. What is the chance(%) that the same candidate gets all the votes?",
      PAGE,
      undefined,
      { answer: solved("25%") },
    ),
    official(
      "Odette's mother has five daughters: Mag, Meg, Mig, Mog. What is the name of the fifth daughter?",
      PAGE,
      undefined,
      { answer: solved("Odette") },
    ),
    official("Which is the most compressible hodler?", PAGE, undefined, {
      answer: solved("0x00000000000000000000000000000000000000000"),
    }),
    official(
      "In order to evolve, a feather needs to give up something. What is it?",
      PAGE,
      undefined,
      { answer: solved("e") },
    ),
    official(
      "WWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWWWWWWWWWWWWWWWWWWBWWWWWWWWWWWWWW => 12W1B12W3B24W1B14W",
      "https://x.com/ArweaveP/status/1136338881593450497",
      undefined,
      { date: "2019-06-05 18:27:56" },
    ),
    official(
      'only a "%" on the 2nd question',
      "https://x.com/ArweaveP/status/1145585725968125953",
      undefined,
      { date: "2019-07-01 06:51:35" },
    ),
    community("no spaces or separators required, CS", WRITEUP),
  ],
});
