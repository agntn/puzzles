import { arweavePuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, standard } from "../../core/parts.ts";

/** Puzzle `arweave/weave5`. */
export const arweavePuzzleWeave5 = arweavePuzzle({
  id: "arweave/weave5",
  address: standard("G2BaxD9phYHJ55VaEY-aX28FtQCKLORMMQSc74IaqYg"),
  sourceUrl: "https://arweave.net/H3NuKVKHTAkb5MqTUbyY77UqiqgExrnTBgc2uKiXq00#instructions",
  startedAt: "2019-05-25 15:45:15",
  status: Status.Claimed,
  prize: 500,
  solvedAt: "2023-09-03 16:38:10",
  solveTime: 134959975,
  transactions: [
    funding("H7PEY8brbrdhiz3EMDjEcVIiTI1EUcQYyO2B8TACPMI", "2019-05-25 15:45:15", 250),
    funding("lRzGOduxfmyb7X1gz9Q_sMJpjy0LgM7vP2izY72TIN8", "2019-06-03 06:45:40", 250),
    claim("ymccg1q8qOyRlF-P9lASjgjl6_2FLiaTbdJ2Tn9HmZQ", "2023-09-03 16:38:10", 499.98423607),
  ],
});
