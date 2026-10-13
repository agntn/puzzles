import { NamedCollection } from "../core/collection.ts";
import { fact, party, PartyKind, profile } from "../core/parts.ts";
import { coinGames1 } from "./coin-games/1.ts";
import { coinGames2 } from "./coin-games/2.ts";
import { coinGames3 } from "./coin-games/3.ts";

/** The Coin_Games home page: the week list, the footer and the donation addresses. */
const HOME = "https://coingames6.webnode.page/";

/** u/3301J's r/bitcoinpuzzles post with the first three images and addresses. */
const ANNOUNCEMENT =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/7hfbar/new_weekly_bitcoin_puzzles_is_it_the_resurrection/";

/** The three funded weeks of Coin_Pro's 2017 banknote puzzles. */
export class CoinGamesCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "coin-games";

  /** Coin_Pro runs the Coin_Games site on Webnode. */
  static readonly author = party("Coin_Pro", {
    key: "coin-pro",
    kind: PartyKind.Person,
    aliases: ["CO||N_PRO"],
    about:
      "Drew Bitcoin puzzles as banknotes for Coin_Games in late 2017 and promised a bigger prize every week until the new year.",
    addresses: ["1LJquQsbjVomQR8gwv878LY6nV5ajVZxnc"],
    profiles: [profile("website", HOME)],
    facts: [
      fact("Signs the Coin_Games pages COIN_PRO / DJ, Producer, Programmer / 2017.", HOME),
      fact(
        "The home page lists puzzles #4 to #6 with Bitcoin prizes of .00013371, .00007771 and .00017771 but no address, and #7 as Funding Unsuccessful.",
        HOME,
      ),
      fact(
        "u/3301J announced the first three puzzles on r/bitcoinpuzzles and named Coin_Pro and Valhalla Games Unlimited as their makers.",
        ANNOUNCEMENT,
        { date: "2017-12-04" },
      ),
    ],
  });

  /** One record per funded week, numbered the way the site numbers them. */
  static readonly puzzles = [coinGames1, coinGames2, coinGames3];

  /** Builds the canonical collection. */
  constructor() {
    super(CoinGamesCollection.key, CoinGamesCollection.author, CoinGamesCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const coinGames = new CoinGamesCollection();
