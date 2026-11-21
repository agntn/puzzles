import { puzzle, Status } from "../../core/puzzle.ts";
import {
  answer,
  assets,
  claim,
  confirmation,
  digest,
  fact,
  funding,
  hex,
  official,
  party,
  PartyKind,
  profile,
  uncompressed,
} from "../../core/parts.ts";

const SOLUTION = "https://echo.ls/zden-level-halv/";

/**
 * Puzzle `zden/level-halv`. The write-up gives the recipe and a solver script but never prints
 * the key, so the hex is that script run once on the repository's image, and the claim's pubkey
 * backs it.
 */
export const zdenPuzzleLevelHalv = puzzle({
  id: "zden/level-halv",
  chain: "bitcoin",
  address: "1crypto24HCr178iMcKd5iUi5D4rsg1nK",
  sourceUrl: "https://crypto.haluska.sk/cryptoHALV.png",
  startedAt: "2024-04-18 10:59:41",
  status: Status.Solved,
  pubkey: uncompressed(
    "04d579d911888e41566daae5e8b639f6321c6ad125a8c1ed8a3b42e7d829014a51ca54c04a2f883eae10e5ce80e4f1d7111ea7e95dde9329ec3e5a74589572b408",
  ),
  key: hex("d27c417d97ccdc0e2ce3291e47b1ee836a5354c4d68f554393dd8d6c4862c999").derived(),
  prize: 0.003125,
  solvedAt: "2026-11-19 21:45:33",
  solveTime: 81686752,
  solver: party("echo.ls", {
    key: "echo-ls",
    kind: PartyKind.Person,
    about:
      "Author of the echo.ls blog, who solved Zden's corrected Level 5 and Level HALV and published the method for both.",
    profiles: [profile("website", "https://echo.ls/")],
    facts: [
      fact(
        "Published the Level HALV method with a solver script: the waveform's quantized peaks, rotated by the stripe and weighted by the block subsidy of each halving epoch, give the 32 key bytes.",
        SOLUTION,
        { date: "2026-11-20" },
      ),
      fact(
        "Wrote that they worked on Level HALV together with Will Adcox, and that a Gemini 4 Neon orchestrator session in Antigravity produced the solution after 9 hours and 19 minutes.",
        SOLUTION,
        { date: "2026-11-20" },
      ),
    ],
  }),
  transactions: [
    funding(
      "30946152b5f24ed975a26b28a46cb19d1ef2728159c5806544ffd0c2fb535205",
      "2024-04-18 10:59:41",
      0.003125,
    ),
    claim(
      "b7fe480c68c1e600355393bc8005e01526340e2db3218aabe82a9439ead34439",
      "2026-11-19 21:45:33",
      0.003116,
    ),
  ],
  assets: assets({
    puzzle: "level-halv/puzzle.png",
    sourceUrl: "https://crypto.haluska.sk/cryptoHALV.png",
    digests: [
      digest(
        "level-halv/puzzle.png",
        "3a487ebaeb4801137f09159a2d533046936cd395f4e2f7d115ac554607790e95",
        61566,
        {
          url: "https://crypto.haluska.sk/cryptoHALV.png",
          archive:
            "https://web.archive.org/web/20250907231738id_/https://crypto.haluska.sk/cryptoHALV.png",
        },
      ),
    ],
  }),
  hints: [
    official(
      "Level HALV - my new crypto puzzle to celebrate the fourth Bitcoin Halving. This level is way easier than LVL 5. It shouldn't take long until it's solved.",
      "https://crypto.haluska.sk/",
      confirmation(
        "https://web.archive.org/web/20240519071031/https://crypto.haluska.sk/",
        "Wayback capture of the puzzle page",
      ),
      {
        answer: answer(
          "The puzzle was funded with 312,500 sats, exactly one-thousandth of the block subsidy after the 4th bitcoin halving, which Zden explicitly said the puzzle was designed to celebrate.",
          SOLUTION,
          { date: "2026-11-20" },
        ),
      },
    ),
  ],
});
