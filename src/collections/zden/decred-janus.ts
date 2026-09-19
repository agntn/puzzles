import { decredPuzzle, Status } from "../../core/puzzle.ts";
import { assets, claim, compressed, funding, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `zden/decred_janus`. */
export const zdenPuzzleDecredJanus = decredPuzzle({
  id: "zden/decred_janus",
  address: p2pkh("DsRaAja82UvgnqYaBHYFuyCKURFX2rCyEJ8"),
  sourceUrl: "https://crypto.haluska.sk/decred_tree.svg",
  startedAt: "2017-03-07 04:20:56",
  status: Status.Solved,
  pubkey: compressed("02278753666ec31c29b755a39421017bd80744d728204da0f7ff452846112b618b"),
  prize: 460,
  solvedAt: "2017-03-18 13:51:29",
  solveTime: 984633,
  transactions: [
    funding(
      "900ed10e661c642f30ec39e09574fcccbb72f4b2ae0733994ffdc945ed4105f2",
      "2017-03-07 04:20:56",
      100,
    ),
    increase(
      "47c3529f1bf28c40e7eb01de47a42b398071a4299dffb5f658b3d5366cba60c2",
      "2017-03-07 04:31:20",
      100,
    ),
    increase(
      "f968a3d99702553bb5cd4243201359abf83e47a88bae318fce4fbd32ed986581",
      "2017-03-07 04:48:32",
      100,
    ),
    increase(
      "2a06e23488d2f62ad117956f9d380dea3ef1402d4708ab11391668d0d1efe90e",
      "2017-03-07 20:38:42",
      150,
    ),
    increase(
      "327a674df974e0a2cb0fc98489e513a34187f1bb1c35811cd5de7e89c58a4b13",
      "2017-03-07 20:55:54",
      5,
    ),
    increase(
      "77f5c42e7bc1627bcc22099dc4a0d7a11d3e97144a9f87f62c324d272a7b4719",
      "2017-03-07 21:00:08",
      5,
    ),
    claim(
      "2af40f17e32a42c18cdfa7ccb552da9201c50ef60db7c60e1ae87f19a74f5467",
      "2017-03-18 13:51:29",
      460,
    ),
  ],
  assets: assets({
    puzzle: "decred_janus/puzzle.svg",
    hints: ["decred_janus/hint.svg"],
    sourceUrl: "https://crypto.haluska.sk/decred_tree.svg",
  }),
});
