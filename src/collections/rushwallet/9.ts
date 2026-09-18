import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/9`. */
export const rushwalletPuzzle9 = bitcoinPuzzle({
  id: "rushwallet/9",
  address: p2pkh("1MmiWF1RaDN3yVwQFZpLRfxzFPRF68D1cT", "e3d776c3d2e1e60fdcb697e6336ddd2b6db41517"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:17:14",
  status: Status.Solved,
  pubkey: uncompressed(
    "04353554bc50692bc7c37229c061fa30d11bba34777f0513fdb39596f2f06f95e6671f93fc7a14dda650957c083198f56be1b1de8b149c122599088efe9fd39683",
  ),
  key: hex("b33618c91eb43dc38ac3d81f008983be0dad8818a761b5e08bfb47d349e09f1f")
    .wif("5KBDJ1QjDuqUm8a6K6hkJ3g1zjb7hpcHGZuDs2wbjtgazFvbqjf")
    .passphrase(
      "supercalifragilisticexpialidocious supercalifragilisticexpialidocious supercalifragilisticexpialidocious",
    ),
  solvedAt: "2014-09-22 23:40:53",
  solveTime: 12219,
  transactions: [
    funding(
      "7ce047c201fe2edbce71dd9cb9e52c34a0860125bbccc0da54dee64fd6815b35",
      "2014-09-22 20:17:14",
      0.05,
    ),
    claim(
      "9c2e31753906a0410a37c9d75654fbb2b328b3c53ffbfe92787bfaa5e38b78d7",
      "2014-09-22 23:40:53",
      0.05,
    ),
  ],
});
