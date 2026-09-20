import { decredPuzzle, Status } from "../../core/puzzle.ts";
import { assets, p2pkh, party, profile } from "../../core/parts.ts";

/** Puzzle `zden/decred_autonomy`, whose archived page links the reward address. */
export const zdenPuzzleDecredAutonomy = decredPuzzle({
  id: "zden/decred_autonomy",
  address: p2pkh("DseEpHK49hHrTJhxwop3B86K1dryv4CYz8N"),
  sourceUrl: "https://web.archive.org/web/20170430210807/https://decred.org/autonomy_puzzle/",
  startedAt: "2017-04-25",
  status: Status.Solved,
  solver: party("BlockCrushr Labs", {
    profiles: [
      profile(
        "solution",
        "https://medium.com/blockcrushr-labs/solving-decreds-autonomy-puzzle-aedac18f18f3",
      ),
    ],
  }),
  assets: assets({
    puzzle: "decred_autonomy/puzzle.jpg",
    sourceUrl: "https://crypto.haluska.sk/gate_full.jpg",
  }),
});
