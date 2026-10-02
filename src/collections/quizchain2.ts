import { NumericCollection } from "../core/collection.ts";
import { quizchain2Block1 } from "./quizchain2/1.ts";
import { quizchain2Block10 } from "./quizchain2/10.ts";
import { quizchain2Block11 } from "./quizchain2/11.ts";
import { quizchain2Block12 } from "./quizchain2/12.ts";
import { quizchain2Block13 } from "./quizchain2/13.ts";
import { quizchain2Block14 } from "./quizchain2/14.ts";
import { quizchain2Block15 } from "./quizchain2/15.ts";
import { quizchain2Block16 } from "./quizchain2/16.ts";
import { quizchain2Block17 } from "./quizchain2/17.ts";
import { quizchain2Block18 } from "./quizchain2/18.ts";
import { quizchain2Block19 } from "./quizchain2/19.ts";
import { quizchain2Block20 } from "./quizchain2/20.ts";
import { quizchain2Block21 } from "./quizchain2/21.ts";
import { quizchain2Block22 } from "./quizchain2/22.ts";
import { quizchain2Block23 } from "./quizchain2/23.ts";
import { quizchain2Block24 } from "./quizchain2/24.ts";
import { quizchain2Block25 } from "./quizchain2/25.ts";
import { quizchain2Block26 } from "./quizchain2/26.ts";
import { quizchain2Block27 } from "./quizchain2/27.ts";
import { quizchain2Block28 } from "./quizchain2/28.ts";
import { quizchain2Block29 } from "./quizchain2/29.ts";
import { quizchain2Block30 } from "./quizchain2/30.ts";
import { quizchain2Block31 } from "./quizchain2/31.ts";
import { quizchain2Block32 } from "./quizchain2/32.ts";
import { quizchain2Block33 } from "./quizchain2/33.ts";
import { quizchain2Block34 } from "./quizchain2/34.ts";
import { quizchain2Block35 } from "./quizchain2/35.ts";
import { quizchain2Block36 } from "./quizchain2/36.ts";
import { quizchain2Block37 } from "./quizchain2/37.ts";
import { quizchain2Block38 } from "./quizchain2/38.ts";
import { quizchain2Block39 } from "./quizchain2/39.ts";
import { quizchain2Block40 } from "./quizchain2/40.ts";
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
    quizchain2Block11,
    quizchain2Block12,
    quizchain2Block13,
    quizchain2Block14,
    quizchain2Block15,
    quizchain2Block16,
    quizchain2Block17,
    quizchain2Block18,
    quizchain2Block19,
    quizchain2Block20,
    quizchain2Block21,
    quizchain2Block22,
    quizchain2Block23,
    quizchain2Block24,
    quizchain2Block25,
    quizchain2Block26,
    quizchain2Block27,
    quizchain2Block28,
    quizchain2Block29,
    quizchain2Block30,
    quizchain2Block31,
    quizchain2Block32,
    quizchain2Block33,
    quizchain2Block34,
    quizchain2Block35,
    quizchain2Block36,
    quizchain2Block37,
    quizchain2Block38,
    quizchain2Block39,
    quizchain2Block40,
  ];

  /** Builds the canonical collection. */
  constructor() {
    super(Quizchain2Collection.key, Quizchain2Collection.author, Quizchain2Collection.puzzles);
  }
}

/** Canonical collection instance. */
export const quizchain2 = new Quizchain2Collection();
