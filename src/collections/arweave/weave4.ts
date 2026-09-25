import { arweavePuzzle, Status } from "../../core/puzzle.ts";
import { claim, fact, funding, party, PartyKind, profile, standard } from "../../core/parts.ts";

/** Puzzle `arweave/weave4`. */
export const arweavePuzzleWeave4 = arweavePuzzle({
  id: "arweave/weave4",
  address: standard("2pwE_LEzD0z6m_ENCDIta9YTBKXW9FFCURrx1yJoO7w"),
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
      fact(
        "ZorenX's write-up of Puzzle 04 names arpox as the solver.",
        "https://zorenx.medium.com/arweave-puzzle-series-puzzle-04-solved-69ca109f3614",
      ),
    ],
  }),
});
