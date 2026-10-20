import { puzzle, Status } from "../../core/puzzle.ts";
import { claim, fact, funding, keyfile, party, PartyKind } from "../../core/parts.ts";

/** The prize wallet's keyfile, sealed in the page's `var msg`. */
const KEYFILE =
  "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";

/** ZorenX's solution, typed into the page's one box without the spaces the write-up prints. */
const ANSWER = "1111:51Nfg368+96938=97006";

/** Puzzle `weave/2`. */
export const weave2 = puzzle({
  id: "weave/2",
  chain: "arweave",
  address: "4WDNiit5lNCZWgxGOK3tTJxS5dOwJjRmTqDnxOjMuWk",
  sourceUrl:
    "https://yvmqerqbjzui3g2lnze7qwkaocl3ikhavhuvl2vvcek4u7f3e2la.arweave.net/xVkCRgFOaI2bS25J-FlAcJe0KOCp6VXqtREVyny7JpY",
  startedAt: "2019-05-24 06:23:05",
  status: Status.Claimed,
  key: keyfile(KEYFILE, { passphrase: ANSWER }),
  prize: 1250,
  solvedAt: "2019-05-24 17:51:23",
  solveTime: 41298,
  transactions: [
    funding("TUNZkBsDP7N0stBp8VCUU86sYhLgYSa6aiPCTJ2kDYU", "2019-05-24 06:23:05", 250),
    funding("0lvvvE0Isy3TqmJwOhIWVidJNECLwdCI5L9vp1JLync", "2019-05-24 10:04:08", 1000),
    claim("NgecvZjHWx9GTi3SdIQnw8SwPQBmJ8BIOVrIvKCQnRY", "2019-05-24 17:51:23", 1249.74967882),
  ],
  solver: party("pogo", {
    key: "pogo",
    kind: PartyKind.Person,
    facts: [
      fact(
        "ZorenX's write-up of Puzzle 02 names pogo as the solver: numbered paper pieces answered with a square count, a chess position and a cryptarithm.",
        "https://zorenx.medium.com/arweave-puzzle-series-puzzle-02-solved-71fd4c71bbc",
      ),
    ],
  }),
});
