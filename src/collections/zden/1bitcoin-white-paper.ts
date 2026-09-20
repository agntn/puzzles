import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import {
  assets,
  claim,
  confirmation,
  decrease,
  funding,
  increase,
  official,
  p2pkh,
  uncompressed,
} from "../../core/parts.ts";

/** Puzzle `zden/1bitcoin_white_paper`. */
export const zdenPuzzle1bitcoinWhitePaper = bitcoinPuzzle({
  id: "zden/1bitcoin_white_paper",
  address: p2pkh("1BiTCoiNsuFnkCFGkv6AGgwWxN31GUwY6W", "75882f9639449778bb4cc2d242ed35dd2cca6f3e"),
  sourceUrl: "https://ipfs.io/ipfs/Qmdm7SxhVGDVt9krbNpwAxkQGwH5a74FVW1sKNXxCjzmBq",
  startedAt: "2021-04-11 01:46:31",
  status: Status.Solved,
  pubkey: uncompressed(
    "04bb16b0a88389b89e0b900f1509589fa7f03e18a4482967b87421c3ab5b6d44d2be549abdb95861b64430b3d6b4ee389d0bf7e5ad554442c5bd12ed1651cf4540",
  ),
  prize: 0.00117578,
  solvedAt: "2021-05-19 18:42:33",
  solveTime: 3344162,
  transactions: [
    funding(
      "063a1913256940e72237419cada939694f4f361d6a1bd2461c5b8387d1b77cb3",
      "2021-04-11 01:46:31",
      0.00117578,
    ),
    decrease(
      "252f49ac38fd858d74baea65e98e44b882d98e794e91426dcc91e62f80d33b56",
      "2021-05-15 05:35:18",
      0.00000777,
    ),
    increase(
      "40138a9fbdbd160df3538efc6a574b7dfc1a98426c3e6046cda0a5892bf17cf6",
      "2021-05-15 23:54:05",
      0.00661489,
    ),
    claim(
      "40b500597aa1d6904db01d36945871a55c5b3a400c4218992d3fbe901cd414b3",
      "2021-05-19 18:42:33",
      0.00732196,
    ),
  ],
  assets: assets({
    puzzle: "1bitcoin_white_paper/puzzle.png",
    sourceUrl: "https://ipfs.io/ipfs/Qmdm7SxhVGDVt9krbNpwAxkQGwH5a74FVW1sKNXxCjzmBq",
  }),
  hints: [
    official(
      "Artwork is also notarized on the Bitcoin blockchain by a transaction of 777 Satoshis from the puzzle's address. The SHA-256 fingerprint from this image creates the private key of the notarization wallet.",
      "https://crypto.haluska.sk/",
      confirmation(
        "https://web.archive.org/web/20210729030148/https://crypto.haluska.sk/",
        "Wayback capture of the puzzle page",
      ),
    ),
  ],
});
