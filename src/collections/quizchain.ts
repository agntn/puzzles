import { NumericCollection } from "../core/collection.ts";
import { quizchainBlock1 } from "./quizchain/1.ts";
import { quizchainBlock10 } from "./quizchain/10.ts";
import { quizchainBlock11 } from "./quizchain/11.ts";
import { quizchainBlock12 } from "./quizchain/12.ts";
import { quizchainBlock13 } from "./quizchain/13.ts";
import { quizchainBlock14 } from "./quizchain/14.ts";
import { quizchainBlock15 } from "./quizchain/15.ts";
import { quizchainBlock16 } from "./quizchain/16.ts";
import { quizchainBlock17 } from "./quizchain/17.ts";
import { quizchainBlock18 } from "./quizchain/18.ts";
import { quizchainBlock19 } from "./quizchain/19.ts";
import { quizchainBlock2 } from "./quizchain/2.ts";
import { quizchainBlock20 } from "./quizchain/20.ts";
import { quizchainBlock21 } from "./quizchain/21.ts";
import { quizchainBlock22 } from "./quizchain/22.ts";
import { quizchainBlock23 } from "./quizchain/23.ts";
import { quizchainBlock24 } from "./quizchain/24.ts";
import { quizchainBlock25 } from "./quizchain/25.ts";
import { quizchainBlock26 } from "./quizchain/26.ts";
import { quizchainBlock27 } from "./quizchain/27.ts";
import { quizchainBlock28 } from "./quizchain/28.ts";
import { quizchainBlock29 } from "./quizchain/29.ts";
import { quizchainBlock3 } from "./quizchain/3.ts";
import { quizchainBlock30 } from "./quizchain/30.ts";
import { quizchainBlock31 } from "./quizchain/31.ts";
import { quizchainBlock32 } from "./quizchain/32.ts";
import { quizchainBlock33 } from "./quizchain/33.ts";
import { quizchainBlock34 } from "./quizchain/34.ts";
import { quizchainBlock35 } from "./quizchain/35.ts";
import { quizchainBlock36 } from "./quizchain/36.ts";
import { quizchainBlock37 } from "./quizchain/37.ts";
import { quizchainBlock38 } from "./quizchain/38.ts";
import { quizchainBlock39 } from "./quizchain/39.ts";
import { quizchainBlock4 } from "./quizchain/4.ts";
import { quizchainBlock40 } from "./quizchain/40.ts";
import { quizchainBlock41 } from "./quizchain/41.ts";
import { quizchainBlock42 } from "./quizchain/42.ts";
import { quizchainBlock43 } from "./quizchain/43.ts";
import { quizchainBlock44 } from "./quizchain/44.ts";
import { quizchainBlock45 } from "./quizchain/45.ts";
import { quizchainBlock46 } from "./quizchain/46.ts";
import { quizchainBlock47 } from "./quizchain/47.ts";
import { quizchainBlock48 } from "./quizchain/48.ts";
import { quizchainBlock49 } from "./quizchain/49.ts";
import { quizchainBlock5 } from "./quizchain/5.ts";
import { quizchainBlock50 } from "./quizchain/50.ts";
import { quizchainBlock51 } from "./quizchain/51.ts";
import { quizchainBlock52 } from "./quizchain/52.ts";
import { quizchainBlock53 } from "./quizchain/53.ts";
import { quizchainBlock54 } from "./quizchain/54.ts";
import { quizchainBlock55 } from "./quizchain/55.ts";
import { quizchainBlock56 } from "./quizchain/56.ts";
import { quizchainBlock57 } from "./quizchain/57.ts";
import { quizchainBlock58 } from "./quizchain/58.ts";
import { quizchainBlock59 } from "./quizchain/59.ts";
import { quizchainBlock6 } from "./quizchain/6.ts";
import { quizchainBlock60 } from "./quizchain/60.ts";
import { quizchainBlock61 } from "./quizchain/61.ts";
import { quizchainBlock62 } from "./quizchain/62.ts";
import { quizchainBlock63 } from "./quizchain/63.ts";
import { quizchainBlock64 } from "./quizchain/64.ts";
import { quizchainBlock65 } from "./quizchain/65.ts";
import { quizchainBlock66 } from "./quizchain/66.ts";
import { quizchainBlock67 } from "./quizchain/67.ts";
import { quizchainBlock68 } from "./quizchain/68.ts";
import { quizchainBlock69 } from "./quizchain/69.ts";
import { quizchainBlock7 } from "./quizchain/7.ts";
import { quizchainBlock70 } from "./quizchain/70.ts";
import { quizchainBlock71 } from "./quizchain/71.ts";
import { quizchainBlock72 } from "./quizchain/72.ts";
import { quizchainBlock73 } from "./quizchain/73.ts";
import { quizchainBlock74 } from "./quizchain/74.ts";
import { quizchainBlock75 } from "./quizchain/75.ts";
import { quizchainBlock76 } from "./quizchain/76.ts";
import { quizchainBlock77 } from "./quizchain/77.ts";
import { quizchainBlock8 } from "./quizchain/8.ts";
import { quizchainBlock9 } from "./quizchain/9.ts";
import { SatoshiBirthdayQuizCollection } from "./satoshi-birthday-quiz.ts";

/** Quizchain, AoiNakamoto's numbered blocks on r/bitcoinpuzzles, addressed by block number. */
export class QuizchainCollection extends NumericCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "quizchain";

  /** Who published the blocks: the account behind the birthday and book quizzes. */
  static readonly author = SatoshiBirthdayQuizCollection.author;

  /** Every puzzle in this collection. */
  static readonly puzzles = [
    quizchainBlock1,
    quizchainBlock2,
    quizchainBlock3,
    quizchainBlock4,
    quizchainBlock5,
    quizchainBlock6,
    quizchainBlock7,
    quizchainBlock8,
    quizchainBlock9,
    quizchainBlock10,
    quizchainBlock11,
    quizchainBlock12,
    quizchainBlock13,
    quizchainBlock14,
    quizchainBlock15,
    quizchainBlock16,
    quizchainBlock17,
    quizchainBlock18,
    quizchainBlock19,
    quizchainBlock20,
    quizchainBlock21,
    quizchainBlock22,
    quizchainBlock23,
    quizchainBlock24,
    quizchainBlock25,
    quizchainBlock26,
    quizchainBlock27,
    quizchainBlock28,
    quizchainBlock29,
    quizchainBlock30,
    quizchainBlock31,
    quizchainBlock32,
    quizchainBlock33,
    quizchainBlock34,
    quizchainBlock35,
    quizchainBlock36,
    quizchainBlock37,
    quizchainBlock38,
    quizchainBlock39,
    quizchainBlock40,
    quizchainBlock41,
    quizchainBlock42,
    quizchainBlock43,
    quizchainBlock44,
    quizchainBlock45,
    quizchainBlock46,
    quizchainBlock47,
    quizchainBlock48,
    quizchainBlock49,
    quizchainBlock50,
    quizchainBlock51,
    quizchainBlock52,
    quizchainBlock53,
    quizchainBlock54,
    quizchainBlock55,
    quizchainBlock56,
    quizchainBlock57,
    quizchainBlock58,
    quizchainBlock59,
    quizchainBlock60,
    quizchainBlock61,
    quizchainBlock62,
    quizchainBlock63,
    quizchainBlock64,
    quizchainBlock65,
    quizchainBlock66,
    quizchainBlock67,
    quizchainBlock68,
    quizchainBlock69,
    quizchainBlock70,
    quizchainBlock71,
    quizchainBlock72,
    quizchainBlock73,
    quizchainBlock74,
    quizchainBlock75,
    quizchainBlock76,
    quizchainBlock77,
  ];

  /** Builds the canonical collection. */
  constructor() {
    super(QuizchainCollection.key, QuizchainCollection.author, QuizchainCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const quizchain = new QuizchainCollection();
