import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/22`. */
export const rushwalletPuzzle22 = bitcoinPuzzle({
  id: "rushwallet/22",
  address: p2pkh("19aWJDZ6i4FGLBrx5u57Qee8bSkmsVdFf6", "5e1730539a07c68d2360ac6af647e5287c282f4f"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:40:50",
  status: Status.Solved,
  pubkey: uncompressed(
    "044fcd0443c927ea612bf0f6308d825623df4f145fea77b54d85e78f8fbe19dd9323b3488f2478d6c8d58d4c94de1986c9ec10e2155b7bf286f0a23528d6ee92d7",
  ),
  key: hex("c8f5cf0d0fca8f31ecde1f93f052c4800248b783c36db01b9c5b74ca8fde637f")
    .wif("5KLnqfYcHiQFtX4eH43ZaEcT7J9rYEgPyNMdgXd55U2bDAtRNoq")
    .passphrase("CLiCK CLACK Click CLiCK CLUCK"),
  solvedAt: "2014-09-23 15:12:09",
  solveTime: 66679,
  transactions: [
    funding(
      "26a69d437296d77c3dbed173c7f504f5085ab24cf0de80a01ff031bdabe33f91",
      "2014-09-22 20:40:50",
      0.025,
    ),
    claim(
      "47b998851a34f600cd480834c1a1e413e7bb87e3702006428fc6b9b5ce331c61",
      "2014-09-23 15:12:09",
      0.025,
    ),
  ],
});
