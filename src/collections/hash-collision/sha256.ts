import { puzzle } from "../../core/puzzle.ts";
import { funding, increase, p2sh, redeemScript, technique } from "../../core/parts.ts";

/** Puzzle `hash-collision/sha256`. */
export const hashCollisionPuzzleSha256 = puzzle({
  id: "hash-collision/sha256",
  chain: "bitcoin",
  address: p2sh(
    "35Snmmy3uhaer2gTboc81ayCip4m9DT4ko",
    "292fb39df7cd619a396069383928e6bfb74ebec5",
    redeemScript("292fb39df7cd619a396069383928e6bfb74ebec5", "6e879169a87ca887"),
  ),
  sourceUrl: "https://bitcointalk.org/index.php?topic=293382.0",
  startedAt: "2013-09-13 05:59:09",
  techniques: [technique("hash-collision", "https://bitcointalk.org/index.php?topic=293382.0")],
  prize: 0.27734251,
  transactions: [
    funding(
      "397f12ee15f8a3d2ab25c0f6bb7d3c64d2038ca056af10dd8251b98ae0f076b0",
      "2013-09-13 05:59:09",
      0.1,
    ),
    increase(
      "44fb218072a12aa7e6944f65048654b1696b9b3e051ffa50c68aefcca5359e75",
      "2013-09-13 11:40:40",
      0.05,
    ),
    increase(
      "23e0e4e243cc2717fa3be4bff8e5a747f0f1f1ffd1c97657945ee82bae33fc51",
      "2014-10-10 08:58:50",
      0.00026888,
    ),
    increase(
      "d488f73dc00846debe87c1044a4080b289c746048f8e3cec2e910e5357341612",
      "2017-02-23 18:27:00",
      0.1,
    ),
    increase(
      "7f80adf2bc2f6a1fad58ae8e4ebeaadcc04ab784f0c9ada63ba67425de6b0f57",
      "2017-02-23 19:42:19",
      0.01,
    ),
    increase(
      "c3c8a720363bc12ee0ca7526ad879f094d67a95e61200d2f3c62ab116bb5d31c",
      "2017-02-23 20:08:10",
      0.01072363,
    ),
    increase(
      "7539a66814805a280b3570ce3c2e51994d996798cb9ca6d88df04e75c6cddc23",
      "2017-02-23 20:49:30",
      0.005,
    ),
    increase(
      "6c806a3e4ef20f8c910d4d5eeda17b57d387757c6f597b36ad91da03c79fc670",
      "2019-04-12 09:19:16",
      0.0001,
    ),
    increase(
      "9c0b22f5cd4b1a23ba7faef01e9382adda160ed5e3162fde96299b3c181dc793",
      "2020-08-25 05:46:48",
      0.00025,
    ),
    increase(
      "0e39f09fe0b1dd4dbad9a442844a285396226a9288f1e0dcc3bb368f7b763043",
      "2025-01-06 11:52:55",
      0.001,
    ),
  ],
});
