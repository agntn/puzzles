import { NumericCollection } from "../core/collection.ts";
import { fact, party, profile } from "../core/parts.ts";
import { cryptoPuzzles1 } from "./crypto-puzzles/1.ts";
import { cryptoPuzzles2 } from "./crypto-puzzles/2.ts";

/** The channel's five videos: two puzzles in two parts each and one solution. */
const CHANNEL = "https://www.youtube.com/channel/UCR8-P07nNhxyEr6fwJXvjQQ";

/** The 2018 Crypto Puzzles channel on YouTube, a raw Ether key hidden in each pair of videos. */
export class CryptoPuzzlesCollection extends NumericCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "crypto-puzzles";

  /** Signs nothing but the channel name, and says "our" once. */
  static readonly author = party("Crypto Puzzles", {
    key: "crypto-puzzles",
    about:
      "YouTube channel that hid Ethereum private keys in pairs of short videos in 2018 and put 0.05 ETH behind each.",
    profiles: [profile("youtube", CHANNEL)],
    facts: [
      fact(
        "Promised 0.05 ETH to the first to solve the two part puzzle: 2 parts, 1 answer.",
        "https://www.youtube.com/watch?v=hX-pOBj8VsI",
        { date: "2018-07-26" },
      ),
      fact(
        "Congratulated at least two solvers of puzzle 1, one who took the 0.05 ETH and one who took the 0.0001 ETH left behind, and showed the key.",
        "https://www.youtube.com/watch?v=0jJ6XadOAWk",
        { date: "2018-08-01" },
      ),
      fact(
        "Called the second puzzle decidedly trickier because the first was solved in hours.",
        "https://www.youtube.com/watch?v=U_0DtYHDPy0",
        { date: "2018-08-27" },
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [cryptoPuzzles1, cryptoPuzzles2];

  /** Builds the canonical collection. */
  constructor() {
    super(
      CryptoPuzzlesCollection.key,
      CryptoPuzzlesCollection.author,
      CryptoPuzzlesCollection.puzzles,
    );
  }
}

/** Canonical collection instance. */
export const cryptoPuzzles = new CryptoPuzzlesCollection();
