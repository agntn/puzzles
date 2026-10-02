import { puzzle, Status } from "../../core/puzzle.ts";
import { assets, claim, digest, funding, hex, uncompressed } from "../../core/parts.ts";

/** Puzzle `zden/codex-protocol`. */
export const zdenPuzzleCodexProtocol = puzzle({
  id: "zden/codex-protocol",
  chain: "ethereum",
  address: "0x6b2560b34c7469c561a8fce581c88bfb8cce73b2",
  sourceUrl: "https://crypto.haluska.sk/CodexPuzzle.png",
  startedAt: "2018-04-16 22:39:45",
  status: Status.Solved,
  pubkey: uncompressed(
    "04b2bb29c9cf6a1c7a048e02cecdd7bec9f4fb3d19e0a9b5c7d7785fb6b17a4d8b11ec437d972a8922838b3af1854f375278ee94758e5c8a4d699072bdd7581301",
  ),
  key: hex("5a9674dbee5a9674dbee5a9674dbee5a9674dbee5a9674dbee5a9674dbfcf3ec"),
  prize: 3.1337,
  solvedAt: "2018-06-13 13:02:18",
  solveTime: 4976553,
  transactions: [
    funding(
      "0xe09300e94625ec03a8680d6270200196a12c63327fc7cad03508542090283374",
      "2018-04-16 22:39:45",
      3.1337,
    ),
    claim(
      "0xeb9f6a7d1cb226c84344b38f9eb5bd26586b58c0080262d80fdcb501c0b51a7b",
      "2018-06-13 13:02:18",
      3.132839,
    ),
  ],
  assets: assets({
    puzzle: "codex-protocol/puzzle.png",
    solution: "codex-protocol/solution.md",
    hints: ["codex-protocol/hint-1.png", "codex-protocol/hint-2.png"],
    sourceUrl: "https://crypto.haluska.sk/CodexPuzzle.png",
    digests: [
      digest(
        "codex-protocol/puzzle.png",
        "a3edc48e1abbcef2158f2c4b94d8157f3df93886167994d60278660cd3543f64",
        20434999,
        { url: "https://crypto.haluska.sk/CodexPuzzle.png" },
      ),
      digest(
        "codex-protocol/hint-1.png",
        "adae828a669377f415fe2b440047ef1bba81161d2ceec7431f0d6dda1707496c",
        20491068,
        {
          url: "https://crypto.haluska.sk/CodexPuzzle-hint.png",
          archive:
            "https://web.archive.org/web/20250929202710id_/https://crypto.haluska.sk/CodexPuzzle-hint.png",
        },
      ),
      digest(
        "codex-protocol/hint-2.png",
        "b369586f13687dbc54e02c9da152df71fe22d8dcb25601947a7cb01dde1997be",
        1053536,
        {
          url: "https://crypto.haluska.sk/CodexPuzzle-hint2.png",
          archive:
            "https://web.archive.org/web/20250929202710id_/https://crypto.haluska.sk/CodexPuzzle-hint2.png",
        },
      ),
      digest(
        "codex-protocol/solution.md",
        "f0a33c6e59006c6706b7133f507646b327fa7ee01f0acf3fc4ce478778dba08e",
        722,
      ),
    ],
  }),
});
