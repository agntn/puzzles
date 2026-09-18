import { ethereumPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, standard } from "../../core/parts.ts";

/** Puzzle `arweave/weave7`. */
export const arweavePuzzleWeave7 = ethereumPuzzle({
  id: "arweave/weave7",
  address: standard("0x13f968d3bb996f39838ade86109b8150ba890d7e"),
  sourceUrl: "https://arweave.net/I9b6im2OKIZh44eMEquRvsISkfl189esaoDSLOO0G9Y",
  startedAt: "2019-06-10 16:40:22",
  status: Status.Claimed,
  prize: 3,
  solvedAt: "2023-09-18 09:00:11",
  solveTime: 134842789,
  transactions: [
    funding(
      "0xbf6dbe70baaa90dd90810ca9fc6e0012bf05419ae92aa7e1d17ecf892515071c",
      "2019-06-10 16:40:22",
      1,
    ),
    funding(
      "0x7f892d644529d231dccfbaf5127634996fbbaf7cc7f4b4866d1c4a9e39bd2c6f",
      "2019-06-12 10:15:06",
      1,
    ),
    funding(
      "0x7a06401c304248848bacdd596391745176888925ed09774aa28058de1148c723",
      "2019-06-12 15:49:55",
      1,
    ),
    claim(
      "0xb62ae885191bd5ef9d822e2ab0c49ce6127e0efcea09fd42f1a4f552b14dc068",
      "2023-09-18 09:00:11",
      2.994808896749136,
    ),
  ],
});
