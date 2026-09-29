import { NamedCollection } from "../core/collection.ts";
import { fact, party, PartyKind, profile } from "../core/parts.ts";
import { dogesGambitDoge } from "./doges-gambit/doge.ts";
import { dogesGambitEth } from "./doges-gambit/eth.ts";

/** The r/dogecoin post that launched Doge's Gambit. */
const LAUNCH =
  "https://www.reddit.com/r/dogecoin/comments/kbcptp/10000_doge_reward_new_cryptocurrency_video_puzzle/";

/** The r/dogecoin post that brought Doge's Gambit back once Dogecoin's price had jumped. */
const REPOST =
  "https://www.reddit.com/r/dogecoin/comments/l7foig/400_unsolved_dogecoin_video_puzzle_10000_doge/";

/** The author's solution to the Dogecoin part of Doge's Gambit. */
const DOGE_SOLUTION = "https://www.youtube.com/watch?v=-7-m60jy1RU";

/**
 * Doge's Gambit by Crypto Puzzlers: one chess board video with an Ether key and a Dogecoin key in
 * its frames, two puzzles and two records.
 */
export class DogesGambitCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "doges-gambit";

  /** One person behind a YouTube channel and a Reddit account of the same name. */
  static readonly author = party("Crypto Puzzlers", {
    key: "cryptopuzzlers",
    kind: PartyKind.Person,
    aliases: ["CryptoPuzzlers", "JT"],
    about:
      "YouTube channel and Reddit account that hid private keys in short video puzzles and paid the prizes in DOGE, ETH, BOMB and Banano.",
    profiles: [
      profile("youtube", "https://www.youtube.com/@cryptopuzzlers3890"),
      profile("reddit", "https://www.reddit.com/user/CryptoPuzzlers"),
    ],
    facts: [
      fact(
        "Posted Doge's Gambit on r/dogecoin as two puzzles in one, made a little harder because the previous puzzle posted there was solved within a few hours.",
        LAUNCH,
        { date: "2020-12-11" },
      ),
      fact(
        "Put $30 to $40 worth of Dogecoin into Doge's Gambit and posted it again seven weeks later, when the price rise had made the unsolved prize worth around $400.",
        REPOST,
        { date: "2021-01-29" },
      ),
      fact(
        "Opens the solution videos as JT and says the Doge's Gambit solver wrote in after about a month of work on it.",
        DOGE_SOLUTION,
        { date: "2021-05-11" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [dogesGambitEth, dogesGambitDoge];

  /** Builds the canonical collection. */
  constructor() {
    super(DogesGambitCollection.key, DogesGambitCollection.author, DogesGambitCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const dogesGambit = new DogesGambitCollection();
