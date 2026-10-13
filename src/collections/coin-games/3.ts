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

/** The week 3 page, dated December 3, 2017. */
const PAGE = "https://coingames6.webnode.page/a3/";

/** Week 3: Venus, the pyramids and a mushroom cloud on one note, emptied in March 2018. */
export const coinGames3 = puzzle({
  id: "coin-games/3",
  chain: "bitcoin",
  address: "1DR2SGyJPFnA5nsCPJqtTUk269wtD3RSo4",
  sourceUrl: PAGE,
  startedAt: "2017-12-03 00:00:00",
  preGenesis: true,
  status: Status.Claimed,
  solvedAt: "2018-03-05 21:56:07",
  solveTime: 8_027_767,
  prize: 0.00006661,
  pubkey: compressed("0327f5f2a0bd3c21016a9c062d4f4236e6b9f3ab25972c3cd8794a620481547c01"),
  hints: [
    official(
      "Difficulty: Medium 12 Words",
      HOME,
      confirmation(HOME_CAPTURE, "The home page as it stood in August 2022."),
    ),
  ],
  assets: assets({
    puzzle: "3/puzzle.png",
    sourceUrl: PAGE,
    digests: [
      digest(
        "3/puzzle.png",
        "d15622845e78829656350c90338914286d1a0fd27cf69c01171edfa06d270132",
        2_729_841,
        { url: `${CDN}/200000024-efc9ff0c1e/1337330119992020.png?ph=386758fd16` },
      ),
    ],
  }),
  transactions: [
    funding(
      "05eaaeceda879b6703534a70d3a87576ae0766015be796ca929bc45417e826e0",
      "2017-11-20 04:37:55",
      0.00006661,
    ),
    claim(
      "b028604b1a8f159c95d9939853ff88073093b432700833004f720a505455379d",
      "2018-03-05 21:56:07",
      0.00005701,
    ),
  ],
  solver: party(undefined, { addresses: ["1MiiZiEFy5mNjjFpiKYVtUG6FyapsogGcN"] }),
});
