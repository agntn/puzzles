import { arweavePuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, party, standard } from "../../core/parts.ts";

/** Puzzle `arweave/weave2`. */
export const arweavePuzzleWeave2 = arweavePuzzle({
  id: "arweave/weave2",
  address: standard("4WDNiit5lNCZWgxGOK3tTJxS5dOwJjRmTqDnxOjMuWk"),
  sourceUrl:
    "https://yvmqerqbjzui3g2lnze7qwkaocl3ikhavhuvl2vvcek4u7f3e2la.arweave.net/xVkCRgFOaI2bS25J-FlAcJe0KOCp6VXqtREVyny7JpY",
  startedAt: "2019-05-24 06:23:05",
  status: Status.Claimed,
  prize: 1250,
  solvedAt: "2019-05-24 17:51:23",
  solveTime: 41298,
  transactions: [
    funding("TUNZkBsDP7N0stBp8VCUU86sYhLgYSa6aiPCTJ2kDYU", "2019-05-24 06:23:05", 250),
    funding("0lvvvE0Isy3TqmJwOhIWVidJNECLwdCI5L9vp1JLync", "2019-05-24 10:04:08", 1000),
    claim("NgecvZjHWx9GTi3SdIQnw8SwPQBmJ8BIOVrIvKCQnRY", "2019-05-24 17:51:23", 1249.74967882),
  ],
  solver: party("pogo"),
});
