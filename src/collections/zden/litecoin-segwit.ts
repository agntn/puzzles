import { litecoinPuzzle, Status } from "../../core/puzzle.ts";
import { assets, claim, compressed, funding, p2pkh } from "../../core/parts.ts";

/** Puzzle `zden/litecoin_segwit`. */
export const zdenPuzzleLitecoinSegwit = litecoinPuzzle({
  id: "zden/litecoin_segwit",
  address: p2pkh("LartGjF6UjmvmF1JXBhFf5wtM9uZX7LzeS", "ab85f21bf9ca1126f3776f4686cf02737be7a2b7"),
  sourceUrl: "https://crypto.haluska.sk/LitecoinSegWit.png",
  startedAt: "2017-05-10 05:46:11",
  status: Status.Solved,
  pubkey: compressed("03bc34c725e24d6159f3e2d3c01d455cf5fd48b83a7ca5eb4c7155044ec728ff11"),
  prize: 230.8255,
  solvedAt: "2017-05-24 01:38:16",
  solveTime: 1194725,
  transactions: [
    funding(
      "bc640bc1ab3756bf5163918e5ee4c7496fcdb2e17617515d17e1f134dabbd318",
      "2017-05-10 05:46:11",
      100,
    ),
    funding(
      "593b72fc6cbe178c239fc6ce4f156c3063eff00e02c023acba4c09ea6be59cc9",
      "2017-05-10 05:54:31",
      10,
    ),
    funding(
      "abb7074c2758e41e9a28ebdd096baae0c25c9453fbddb93d29edaf1ff2541c19",
      "2017-05-10 16:58:49",
      100,
    ),
    funding(
      "e260a3f11de536f9bb618e16b00f584e59b8695fa4bed4bdb6eded739375bcb5",
      "2017-05-10 17:36:16",
      1.337,
    ),
    funding(
      "9c9ee2b1ca0fb8517ab6328f2bd3016e717b36264afdc84f1cf22afecb270943",
      "2017-05-11 10:36:26",
      18.4985,
    ),
    funding(
      "17ee706bed97ffe9ac3762aa4d93b6d20bda3b04e334e6c1165a17bc2972a327",
      "2017-05-13 05:56:37",
      0.99,
    ),
    claim(
      "fb5260a9225cdbe0733874ac51e9391acbdec3a8e031fd9851e84d55ac57034c",
      "2017-05-24 01:38:16",
      230.8255,
    ),
  ],
  assets: assets({
    puzzle: "litecoin_segwit/puzzle.png",
    sourceUrl: "https://crypto.haluska.sk/LitecoinSegWit.png",
  }),
});
