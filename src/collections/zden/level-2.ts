import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { assets, claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `zden/level_2`. */
export const zdenPuzzleLevel2 = bitcoinPuzzle({
  id: "zden/level_2",
  address: p2pkh("1cryptoTuax4qeedzVC35eYf4c16v4reJ", "06c84797d2819c984eb9045c1510b0e4fe8d7bf0"),
  sourceUrl: "https://crypto.haluska.sk/",
  startedAt: "2016-06-16 22:14:33",
  status: Status.Solved,
  pubkey: uncompressed(
    "040616b3227a76ebd896a916be772a5174cfced52413e4180a7be1ab128fc1acb6f839c4e5c7e9c52815a9daa728ab7f14302e2acb51227dca6a654f18d51f78e8",
  ),
  key: hex("febedbdd99c7a288eafb6ec1b0fdc3e10a09567ff8a3ab30b9fdf69eb492a6dc").wif(
    "5KkUiPnCoG6JteP1fdZLYTGYu7RAPymsWB82hF1xkXRPNBD6FLd",
  ),
  prize: 0.0260414,
  solvedAt: "2016-06-18 23:28:47",
  solveTime: 177254,
  transactions: [
    funding(
      "8521d9eceed6657f121d439a4f4b8125850286b4d776eeee5bed10470f537e05",
      "2016-06-16 22:14:33",
      0.0260414,
    ),
    claim(
      "182975827270745a939511f2b0e30e55f50ce4797cd987d887beb88dea7c9772",
      "2016-06-18 23:28:47",
      0.0260414,
    ),
  ],
  assets: assets({
    puzzle: "level_2/puzzle.png",
    solver: "level_2/solver.png",
    sourceUrl: "https://crypto.haluska.sk/crypto2.png",
  }),
});
