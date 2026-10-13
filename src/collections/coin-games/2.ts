import {
  assets,
  claim,
  compressed,
  confirmation,
  digest,
  funding,
  official,
  party,
} from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The Coin_Games home page, which lists every week with its prize, word count and state. */
const HOME = "https://coingames6.webnode.page/";

/** The August 2022 Wayback capture of the home page, the oldest one with the puzzle list. */
const HOME_CAPTURE = "https://web.archive.org/web/20220813091533/https://coingames6.webnode.page/";

/** The Webnode CDN folder that still serves the puzzle images. */
const CDN = "https://386758fd16.cbaul-cdnwnd.com/9c493a7ec34929c379f1104e3122787b";

/** The puzzle #2 page, dated November 26, 2017. */
const PAGE = "https://coingames6.webnode.page/a2/";

/** Week 2: a lion at Stonehenge on a banknote worth 3301 sats, emptied nine months in. */
export const coinGames2 = puzzle({
  id: "coin-games/2",
  chain: "bitcoin",
  address: "1PMvVyADCztUAWx55AoUiUo9jyB5UA19GL",
  sourceUrl: PAGE,
  startedAt: "2017-11-26 00:00:00",
  preGenesis: true,
  status: Status.Claimed,
  solvedAt: "2018-08-19 21:08:28",
  solveTime: 23_058_508,
  prize: 0.00003301,
  pubkey: compressed("03c0bd7c4b441e1abe699bb770fe9c47aa3bf20ad791dbf5deea5c210e2d4a6335"),
  hints: [
    official(
      "Difficulty: Medium 16 Words",
      HOME,
      confirmation(HOME_CAPTURE, "The home page as it stood in August 2022."),
    ),
  ],
  assets: assets({
    puzzle: "2/puzzle.png",
    sourceUrl: PAGE,
    digests: [
      digest(
        "2/puzzle.png",
        "2b279cb7e617021cd0904349ba5cb15959e45ddf5fdce596f97e1b1a01d20d61",
        3_300_973,
        { url: `${CDN}/200000023-5e90d5f8ca/eviltrumpdollar2.png?ph=386758fd16` },
      ),
    ],
  }),
  transactions: [
    funding(
      "15c705bb0d65e7cb800c236cc1f219e4b3db9d5772935d4aea6d3f550f60f54f",
      "2017-11-20 04:47:17",
      0.00003301,
    ),
    claim(
      "d5efdb6e62e85f3d603c37d4e3ded82cddbb7e71f8a7d36c9848caa7f9a99157",
      "2018-08-19 21:08:28",
      0.0000309,
    ),
  ],
  solver: party(undefined, { addresses: ["1NXB3Mimrpij1HCz2wWJR3tpRcHexsuQM3"] }),
});
