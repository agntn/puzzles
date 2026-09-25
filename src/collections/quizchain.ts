import { NumericCollection } from "../core/collection.ts";
import { quizchainBlock1 } from "./quizchain/1.ts";
import { quizchainBlock2 } from "./quizchain/2.ts";
import { quizchainBlock3 } from "./quizchain/3.ts";
import { quizchainBlock4 } from "./quizchain/4.ts";
import { quizchainBlock5 } from "./quizchain/5.ts";
import { quizchainBlock6 } from "./quizchain/6.ts";
import { quizchainBlock7 } from "./quizchain/7.ts";
import { quizchainBlock8 } from "./quizchain/8.ts";
import { SatoshiBirthdayQuizCollection } from "./satoshi_birthday_quiz.ts";

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
  ];

  /** Builds the canonical collection. */
  constructor() {
    super(QuizchainCollection.key, QuizchainCollection.author, QuizchainCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const quizchain = new QuizchainCollection();
