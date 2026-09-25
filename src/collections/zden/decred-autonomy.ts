import { decredPuzzle, Status } from "../../core/puzzle.ts";
import { assets, fact, p2pkh, party, PartyKind, profile } from "../../core/parts.ts";

/** Puzzle `zden/decred_autonomy`, whose archived page links the reward address. */
export const zdenPuzzleDecredAutonomy = decredPuzzle({
  id: "zden/decred_autonomy",
  address: p2pkh("DseEpHK49hHrTJhxwop3B86K1dryv4CYz8N"),
  sourceUrl: "https://web.archive.org/web/20170430210807/https://decred.org/autonomy_puzzle/",
  startedAt: "2017-04-25",
  status: Status.Solved,
  solver: party("BlockCrushr Labs", {
    key: "blockcrushr-labs",
    kind: PartyKind.Organization,
    about: "Blockchain development lab whose Medium publication carries the Autonomy walk-through.",
    profiles: [
      profile(
        "solution",
        "https://medium.com/blockcrushr-labs/solving-decreds-autonomy-puzzle-aedac18f18f3",
      ),
      profile("medium", "https://medium.com/blockcrushr-labs"),
    ],
    facts: [
      fact(
        "Scott Burke wrote the walk-through for the publication: gears measured in pixels, a Gandhi quote as the Vigenère key, a 33-word seed.",
        "https://medium.com/blockcrushr-labs/solving-decreds-autonomy-puzzle-aedac18f18f3",
        { date: "2017-05-08" },
      ),
    ],
  }),
  assets: assets({
    puzzle: "decred_autonomy/puzzle.jpg",
    sourceUrl: "https://crypto.haluska.sk/gate_full.jpg",
  }),
});
