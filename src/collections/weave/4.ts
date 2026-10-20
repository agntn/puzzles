import { puzzle, Status } from "../../core/puzzle.ts";
import {
  answer,
  claim,
  community,
  fact,
  funding,
  keyfile,
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

/** The prize wallet's keyfile, sealed in the page's `var msg`. */
const KEYFILE =
  "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";

/** The answer string from arpox's reply and the write-up, 41 zeros and all. */
const ANSWER = "1225%Odette0x00000000000000000000000000000000000000000e";

/** Puzzle `weave/4`. */
export const weave4 = puzzle({
  id: "weave/4",
  chain: "arweave",
  address: "2pwE_LEzD0z6m_ENCDIta9YTBKXW9FFCURrx1yJoO7w",
  sourceUrl:
    "https://ojducxyzj2dirbt7xt2jod7dkwfqolxjre6tzp63fycuq5477vta.arweave.net/ckdBXxlOhoiGf7z0lw_jVYsHLumJPTy_2y4FSHef_WY#instructions",
  startedAt: "2019-05-25 15:39:57",
  status: Status.Claimed,
  key: keyfile(KEYFILE, { passphrase: ANSWER }),
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
