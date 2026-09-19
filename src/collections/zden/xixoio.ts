import { ethereumPuzzle, Status } from "../../core/puzzle.ts";
import {
  assets,
  claim,
  confirmation,
  funding,
  official,
  standard,
  uncompressed,
} from "../../core/parts.ts";

/** Puzzle `zden/xixoio`. */
export const zdenPuzzleXixoio = ethereumPuzzle({
  id: "zden/xixoio",
  address: standard("0x5d663791e869ca70c71e0a5f4cfd707f596265aa"),
  sourceUrl: "https://crypto.haluska.sk/xixoio_puzzle.png",
  startedAt: "2018-10-24 20:00:18",
  status: Status.Solved,
  pubkey: uncompressed(
    "04da1a5098d80ce66b4c9fd974b9d9164d57caf1263d834c961c89b117a412ece1703a3bb1d606d03c1c4ff9225b556c291c2c6fbd67968f451f472a827dc9e781",
  ),
  prize: 6,
  solvedAt: "2019-11-05 17:08:08",
  solveTime: 32562470,
  transactions: [
    funding(
      "0xb9658922bcc5b3d35dc4b054c40607090c755dd86d8891e6351a25c43cc653ac",
      "2018-10-24 20:00:18",
      6,
    ),
    claim(
      "0xac638a7ac6388b7af2178a52f0463a6dda8761292d261fa415c6446c8d4539f0",
      "2019-11-05 17:08:08",
      5.997858,
    ),
  ],
  assets: assets({
    puzzle: "xixoio/puzzle.png",
    sourceUrl: "https://crypto.haluska.sk/xixoio_puzzle.png",
  }),
  hints: [
    official(
      "Byte 0x77 is part of the private key.",
      "https://twitter.com/Zd3N/status/1077146640090316800",
      confirmation(
        "https://web.archive.org/web/20220129183939/https://twitter.com/Zd3N/status/1077146640090316800",
        "Wayback capture of the tweet, the XIXOIO part of a hints bundle",
      ),
      { date: "2018-12-24 10:19:06" },
    ),
  ],
});
