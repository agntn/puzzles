import { NumericCollection } from "../core/collection.ts";
import { quizchain2Block1 } from "./quizchain2/1.ts";
import { quizchain2Block10 } from "./quizchain2/10.ts";
import { quizchain2Block2 } from "./quizchain2/2.ts";
import { quizchain2Block3 } from "./quizchain2/3.ts";
import { quizchain2Block4 } from "./quizchain2/4.ts";
import { quizchain2Block5 } from "./quizchain2/5.ts";
import { quizchain2Block6 } from "./quizchain2/6.ts";
import { quizchain2Block7 } from "./quizchain2/7.ts";
import { quizchain2Block8 } from "./quizchain2/8.ts";
import { quizchain2Block9 } from "./quizchain2/9.ts";
import { QuizchainCollection } from "./quizchain.ts";

/** Quizchain2, AoiNakamoto's second run of numbered blocks on r/bitcoinpuzzles, addressed by block number. */
export class Quizchain2Collection extends NumericCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "quizchain2";

  /** Who published the blocks: the same account as the first run. */
  static readonly author = QuizchainCollection.author;

  /** Every puzzle in this collection. */
  static readonly puzzles = [
    quizchain2Block1,
    quizchain2Block2,
    quizchain2Block3,
    quizchain2Block4,
    quizchain2Block5,
    quizchain2Block6,
    quizchain2Block7,
    quizchain2Block8,
    quizchain2Block9,
    quizchain2Block10,
  ];

  /** Builds the canonical collection. */
  constructor() {
    super(Quizchain2Collection.key, Quizchain2Collection.author, Quizchain2Collection.puzzles);
  }
}

/** Canonical collection instance. */
export const quizchain2 = new Quizchain2Collection();
