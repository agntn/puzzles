import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import {
  assets,
  claim,
  confirmation,
  funding,
  increase,
  official,
  p2pkh,
  uncompressed,
} from "../../core/parts.ts";

/** Puzzle `zden/demobit-2018`. */
export const zdenPuzzleDemobit2018 = bitcoinPuzzle({
  id: "zden/demobit-2018",
  address: p2pkh("1cryptotnptVK1ZbpZFyEqcR5EVp5hjfk", "06c84797d30988bc82a337117d02d7c4347fd35b"),
  sourceUrl: "https://crypto.haluska.sk/crypto_db18.png",
  startedAt: "2018-01-23 14:51:43",
  status: Status.Solved,
  pubkey: uncompressed(
    "04fc4f71ab4554b2ea1203b1cf6d0cfaf179213d7fa028be7dda5c183807792b15c5c0146f10be96bebf2fc1fb41637bd0b16d2d534e14b649da6ab7420e143b74",
  ),
  prize: 0.01500245,
  solvedAt: "2018-03-25 16:56:41",
  solveTime: 5277898,
  transactions: [
    funding(
      "5ca022fa2425eeb32f0ea7eb78e20501ea7907dae62e8467cd9a24a41e45c6bc",
      "2018-01-23 14:51:43",
      0.03499755,
    ),
    increase(
      "66271b073584588d92cd12fdb2b86f52f603daf64670e1cd6aa94e91e32e467e",
      "2018-03-22 10:54:29",
      0.01500245,
    ),
    claim(
      "4f2c8aca892e54810a3febfb39d48ce610aca1bc23b6611e46292566b84b202a",
      "2018-03-25 16:56:41",
      0.05,
    ),
  ],
  assets: assets({
    puzzle: "demobit-2018/puzzle.png",
    sourceUrl: "https://crypto.haluska.sk/crypto_db18.png",
  }),
  hints: [
    official(
      "Hint #1 for the unsolved Demobit puzzle is the hash of inner data block with lines overlap. It is not the hash of the private key! SHA-256: 1c10494cf872ac2b896f52b2c93f58c23049f5be9455fef3ed4f9d9bf84fe600",
      "https://twitter.com/Zd3N/status/966275899757879298",
      confirmation(
        "https://web.archive.org/web/20180316114954/http://crypto.haluska.sk/",
        "Wayback capture of the puzzle page, which links Hint #1 to this tweet",
      ),
      { date: "2018-02-21 11:38:21" },
    ),
  ],
});
