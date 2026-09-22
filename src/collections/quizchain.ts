import { NumericCollection } from "../core/collection.ts";
import { quizchainBlock1 } from "./quizchain/1.ts";
import { SatoshiBirthdayQuizCollection } from "./satoshi_birthday_quiz.ts";

/** Quizchain, AoiNakamoto's numbered blocks on r/bitcoinpuzzles, addressed by block number. */
export class QuizchainCollection extends NumericCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "quizchain";

  /** Who published the blocks: the account behind the birthday and book quizzes. */
  static readonly author = SatoshiBirthdayQuizCollection.author;

  /** Every puzzle in this collection. */
  static readonly puzzles = [quizchainBlock1];

  /** Builds the canonical collection. */
  constructor() {
    super(QuizchainCollection.key, QuizchainCollection.author, QuizchainCollection.puzzles);
  }
}

/** Canonical collection instance. */
export const quizchain = new QuizchainCollection();
