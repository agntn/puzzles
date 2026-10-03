import { SingletonCollection } from "../core/collection.ts";
import {
  answer,
  claim,
  community,
  fact,
  funding,
  hex,
  increase,
  official,
  party,
  PartyKind,
  profile,
  sweep,
  technique,
  uncompressed,
} from "../core/parts.ts";
import { puzzle, Status } from "../core/puzzle.ts";

/** The thread: the signed question, the rules, the funding txid and, months later, the answer. */
const THREAD = "https://bitcointalk.org/index.php?topic=5096267.0";

/**
 * A post in the thread, by its message id.
 *
 * @param {number} id - The number after `msg` in the post's permalink.
 * @returns {string} The post's permalink.
 */
function post(id: number): string {
  return `https://bitcointalk.org/index.php?topic=5096267.msg${id}#msg${id}`;
}

/** blockladder's only post in the thread: the question, the rules, the signature and the txid. */
const ANNOUNCEMENT = post(49190307);

/** akkort's post with the eight words, the day after the prize moved. */
const ANSWER = post(52231664);

/** The author's forum profile: four posts, the last one minutes after the puzzle. */
const AUTHOR_PROFILE = "https://bitcointalk.org/index.php?action=profile;u=683826";

/** Eight camel case words as raw key bytes, posted by akkort the day after the prize moved. */
export const natashaOtomoskiQuestion = puzzle({
  id: "natasha-otomoski",
  chain: "bitcoin",
  address: "179sxfh6rw6bHSo5wVUhLP96k46QaEzVP",
  sourceUrl: THREAD,
  startedAt: "2019-01-12 10:33:13",
  preGenesis: true,
  status: Status.Solved,
  solvedAt: "2019-08-21 17:05:02",
  solveTime: 19117909,
  pubkey: uncompressed(
    "042b0763e8ce0c77dc0ac7511a0cc5c2ae466c85fd7dcbfe297b47790914f3e10a7639afd881f0493e59e31120a5e7c005b63072a79f6ffbb447e7c0e363ab6f9a",
  ),
  key: hex("536865486164546865496465615768696c65436f6d62696e6748657248616972").wif(
    "5JT281eare7tuC1v659kZRdJT91zyAR7XkuXsFibjpHa4BcSQRW",
  ),
  techniques: [technique("ascii-private-key", ANNOUNCEMENT)],
  prize: 1,
  hints: [
    official("WhyTheCombOfNatashaOtomoskiHas21Teeth?.txt", ANNOUNCEMENT, undefined, {
      date: "2019-01-12",
      answer: answer("SheHadTheIdeaWhileCombingHerHair", ANSWER, { date: "2019-08-22" }),
    }),
    official(
      "The solution is a 32 characters long plain-text (the private key).",
      ANNOUNCEMENT,
      undefined,
      { date: "2019-01-12" },
    ),
    official("Hint: 8 camel case english words, no special symbols", ANNOUNCEMENT, undefined, {
      date: "2019-01-12",
    }),
    community(
      "Obviously she isn't him, but 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 S A T O S H I N A K A M O T O 8 2 3 9 1 6 11 4 14 13 12 15 5 10 7 N A T A S H A O T O M O S K I",
      post(49196415),
      undefined,
      { date: "2019-01-12" },
    ),
  ],
  transactions: [
    funding(
      "39ae730abf9190f1985a3600e35b6451efc51bfb885bc9d1c3b91d502de3907d",
      "2019-01-12 09:32:43",
      1,
    ),
    claim(
      "b01af713b3c43c7e60ed03ada26a64a92f68be2f561ecf17c67e22393c10da53",
      "2019-08-21 17:05:02",
      0.99996681,
    ),
    increase(
      "7b6a8ac2ee01a5c696adc04102da0efb8f3d097fccabf447a686c15fba5ce258",
      "2026-05-26 10:16:52",
      0.0000078,
    ),
    sweep(
      "1718788379eb5d5d26cbe91f0a79c01a87a96305fb25bc2e2a91e94d4f8aa614",
      "2026-05-26 10:16:52",
      0.0000033,
    ),
  ],
  solver: party("akkort", {
    key: "akkort",
    about:
      "BitcoinTalk user who posted the eight words a day after the prize moved and kept the method private.",
    profiles: [profile("bitcointalk", "https://bitcointalk.org/index.php?action=profile;u=884731")],
    facts: [
      fact(
        "Posted SheHadTheIdeaWhileCombingHerHair and promised to publish the method once the creator made a new puzzle with the same rules.",
        ANSWER,
        { date: "2019-08-22" },
      ),
      fact(
        "Answered a doubt in the thread with the WIF and the bytes it decodes to, the 32 ASCII characters of the answer.",
        post(52236254),
        { date: "2019-08-22" },
      ),
      fact(
        "Called the method probabilistic and said a new puzzle would prove they weren't the creator.",
        post(52247228),
        { date: "2019-08-23" },
      ),
    ],
  }),
});

/** The Natasha Otomoski puzzle, one 1 BTC question by blockladder. */
export class NatashaOtomoskiCollection extends SingletonCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "natasha-otomoski";

  /** Who published the puzzle. */
  static readonly author = party("blockladder", {
    key: "blockladder",
    kind: PartyKind.Person,
    about:
      "BitcoinTalk account that put 1 BTC behind one question in 2019, signed it with the prize address and never posted again.",
    profiles: [profile("bitcointalk", AUTHOR_PROFILE)],
    facts: [
      fact(
        "Opened the thread with the question, the rules and the funding txid, signed by the prize address.",
        ANNOUNCEMENT,
        { date: "2019-01-12" },
      ),
      fact(
        "Registered in December 2015 and was last active three minutes after the puzzle post, with four posts in all.",
        AUTHOR_PROFILE,
      ),
    ],
  });

  /** Every puzzle in this collection. */
  static readonly puzzles = [natashaOtomoskiQuestion];

  /** Builds the canonical collection. */
  constructor() {
    super(
      NatashaOtomoskiCollection.key,
      NatashaOtomoskiCollection.author,
      NatashaOtomoskiCollection.puzzles,
    );
  }
}

/** Canonical collection instance. */
export const natashaOtomoski = new NatashaOtomoskiCollection();
