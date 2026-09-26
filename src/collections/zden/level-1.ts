import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { assets, claim, funding, hex, increase, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `zden/level-1`. */
export const zdenPuzzleLevel1 = bitcoinPuzzle({
  id: "zden/level-1",
  address: p2pkh("1cryptommoqPHVNHuxVQG3bzujnRJYB1D", "06c84797d2e333a2e692bb1c248f2cb20be50852"),
  sourceUrl: "https://crypto.haluska.sk/",
  startedAt: "2016-06-07 21:05:42",
  status: Status.Solved,
  pubkey: uncompressed(
    "0408fe136fc5f5ab550da96673c050c539ce9877ec69965dde958d080cc4a2b896d6db9afd83e05875a401edcbc0e870c23251cb12b55677dba04a495806fd9fb7",
  ),
  key: hex("46c92e7276ae95778df0d7a248ab736cb6275190ded54438377a2e4b0d42a096").wif(
    "5JMTiDVHj3pj8VfaTe6pDtD9byZr6too3PD3AGBJrXF1hVsitc8",
  ),
  prize: 0.0260414,
  solvedAt: "2016-06-10 21:20:40",
  solveTime: 260098,
  transactions: [
    funding(
      "9405a925ae4a1a64949ea60a72d1b74ad4e3fcb3c1378fc91c7991cc09a584e7",
      "2016-06-07 21:05:42",
      0.0260414,
    ),
    increase(
      "f3d1387c7fc6f20b197900bdbfdaf4f260b480500029ab9680695832111bc1b9",
      "2016-06-10 18:23:19",
      0.00195488,
    ),
    claim(
      "1d3f290a9f43721c2b235a4f72aeab35a78607abb440f02cce9c62a78f271e2d",
      "2016-06-10 21:20:40",
      0.02799628,
    ),
  ],
  assets: assets({
    puzzle: "level-1/puzzle.png",
    solution: "level-1/solver.png",
    sourceUrl: "https://crypto.haluska.sk/crypto1.png",
  }),
});
