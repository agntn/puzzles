import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { assets, claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `ballet/AA007448`. */
export const balletPuzzleAA007448 = bitcoinPuzzle({
  id: "ballet/AA007448",
  address: p2pkh("1LL6Xy92LwGDRfQP9fBU7f1477cEKctr7c", "d406e9a3e9969c600cf2075631600d2079e5fe40"),
  sourceUrl: "https://x.com/bobbyclee/status/1289004702122643456",
  startedAt: "2020-07-24 05:46:12",
  status: Status.Solved,
  pubkey: compressed("0351a7b8675ac06922080803608908267ec7f5bf93ecdd78969083647ac8a67d0d"),
  key: hex("a5b9247400b7e31e54481f14828ced3a538af280e9eeb1229196c3cb5e7ecdde")
    .wif("L2mrYyo5a6rpyQdC88UitNeH5n1rAqPcq8Qv5gwtQE8KTvW3ZTeH")
    .encrypted("6PnWfKaBfDW6mFFhhFsbNRHnVgojUhdf2b5NXP3FfwXiQ69MxEzVK2J4cH", {
      passphrase: "335Y-K745-C8WT-4D2W-80WP",
    }),
  prize: 0.0011,
  solvedAt: "2020-07-31 01:52:18",
  solveTime: 590766,
  transactions: [
    funding(
      "3771eac625e0ac4eb60bab31ea73424634b068ac4e724af0cd87330311837933",
      "2020-07-24 05:46:12",
      0.0011,
    ),
    claim(
      "61eec2eddf3b3d9973561a3d3ebeecf82ba0700564f45e77ee33a8f8f9f9bd9e",
      "2020-07-31 01:52:18",
      0.0011,
    ),
  ],
  assets: assets({
    puzzle: "AA007448/puzzle.jpg",
    sourceUrl: "https://x.com/bobbyclee/status/1289004702122643456",
  }),
});
