import { ethereumPuzzle, Status } from "../../core/puzzle.ts";
import { assets, claim, funding, standard, uncompressed } from "../../core/parts.ts";

/** Puzzle `zden/codex_protocol`. */
export const zdenPuzzleCodexProtocol = ethereumPuzzle({
  id: "zden/codex_protocol",
  address: standard("0x6b2560b34c7469c561a8fce581c88bfb8cce73b2"),
  sourceUrl: "https://crypto.haluska.sk/CodexPuzzle.png",
  startedAt: "2018-04-16 22:39:45",
  status: Status.Solved,
  pubkey: uncompressed(
    "04b2bb29c9cf6a1c7a048e02cecdd7bec9f4fb3d19e0a9b5c7d7785fb6b17a4d8b11ec437d972a8922838b3af1854f375278ee94758e5c8a4d699072bdd7581301",
  ),
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
    puzzle: "codex_protocol/puzzle.png",
    sourceUrl: "https://crypto.haluska.sk/CodexPuzzle.png",
  }),
});
