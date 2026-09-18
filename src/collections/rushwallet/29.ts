import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/29`. */
export const rushwalletPuzzle29 = bitcoinPuzzle({
  id: "rushwallet/29",
  address: p2pkh("1N1YaNNTNw54g1djCAwcstrVGpgjDqrnsQ", "e674ffcc0f885de20bc4c122b97dd7e0dd0d6048"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:17:14",
  status: Status.Solved,
  pubkey: uncompressed(
    "044c63eba3e8037e65156bc1f7659b6a0019dee7dd9992914b30b9e5949259aa6a2de3bdd46bb63977f45f2873c6de4732419e79be66818078d66ff55d187bc90b",
  ),
  key: hex("e1b404bb5fdd9941b0743b3fa49fe28d076211ac7dd4462a3274df8d67dd5f5e")
    .wif("5KXgsE2AkJjtuJiEqTvxc5zJMZjbAZD6qBGU3ZhnExBcUPioUR8")
    .passphrase("THE MYSTERY MAN BEHIND THE CRYPTO-CURRENCY"),
  solvedAt: "2014-09-23 17:17:35",
  solveTime: 75621,
  transactions: [
    funding(
      "574876a325f5ffda9569a4df9e3574b1019e4f773204f61e37bf83b90c17093d",
      "2014-09-22 20:17:14",
      0.1,
    ),
    claim(
      "c4fa1a199e2f2a08a425c2dc11bfeb39c6ceaa6ce10746fdf7cf6d8b430cf283",
      "2014-09-23 17:17:35",
      0.1,
    ),
  ],
});
