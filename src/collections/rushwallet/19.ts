import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/19`. */
export const rushwalletPuzzle19 = bitcoinPuzzle({
  id: "rushwallet/19",
  address: p2pkh("1BwnBeM3xHh8cVmQDUmQjWMENxB1APLDSE", "780d6fe40e291ca159e48e2e372331b43d4d81ab"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:32:38",
  status: Status.Solved,
  pubkey: uncompressed(
    "045459e22b853b2419db97609a030bfe06c936b47a973fa8f9dae407f6b05966cb3888b1771ac4b3b5443c49e45060ab79033d48c033a796cbd782c5fa06aa11e5",
  ),
  key: hex("d2cddeb1e8778dbf975f00b32a68e20fe3ab73565d7737c76a0217191afef8cd")
    .wif("5KR8HrKgG9TefHX1YGk8d9AXKA8EWe19SHH6cMUQTeX1dRQJ8r2")
    .passphrase("you thought this was a clue but its not that easy"),
  solvedAt: "2014-09-23 14:03:49",
  solveTime: 63071,
  transactions: [
    funding(
      "6c1331573603362f808cc88692829128835a703125547c91eb3d648b19ca02e8",
      "2014-09-22 20:32:38",
      0.025,
    ),
    claim(
      "26a69b8756fc4c58499af364e4fe9b8496f50854a72c87ddd62257a1b8bd3144",
      "2014-09-23 14:03:49",
      0.025,
    ),
  ],
});
