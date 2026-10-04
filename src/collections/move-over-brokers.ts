import { NamedCollection } from "../core/collection.ts";
import { fact, party, PartyKind, profile } from "../core/parts.ts";
import { moveOverBrokersEnEasy1 } from "./move-over-brokers/en-easy-1.ts";
import { moveOverBrokersEnEasy2 } from "./move-over-brokers/en-easy-2.ts";
import { moveOverBrokersEnHard1 } from "./move-over-brokers/en-hard-1.ts";
import { moveOverBrokersEnHard2 } from "./move-over-brokers/en-hard-2.ts";
import { moveOverBrokersEnMedium1 } from "./move-over-brokers/en-medium-1.ts";
import { moveOverBrokersEnMedium2 } from "./move-over-brokers/en-medium-2.ts";
import { moveOverBrokersEnVeryHard1 } from "./move-over-brokers/en-very-hard-1.ts";
import { moveOverBrokersEnVeryHard2 } from "./move-over-brokers/en-very-hard-2.ts";
import { moveOverBrokersItEasy } from "./move-over-brokers/it-easy.ts";
import { moveOverBrokersItHard } from "./move-over-brokers/it-hard.ts";
import { moveOverBrokersItMedium } from "./move-over-brokers/it-medium.ts";
import { moveOverBrokersItVeryHard } from "./move-over-brokers/it-very-hard.ts";

/** The author's retrospective: why the hunt exists, all twelve addresses, and no keys kept. */
const ARTICLE = "https://kf106.medium.com/everyone-loves-a-treasure-hunt-93885ae8d80a";

/** Keir Finlow-Bates's book hunt: eight keys in English, four in Italian, 0.002 BTC each. */
export class MoveOverBrokersCollection extends NamedCollection {
  /** Stable collection key used in puzzle identifiers. */
  static readonly key = "move-over-brokers";

  /** Who wrote the book and funded the lots. */
  static readonly author = party("Keir Finlow-Bates", {
    key: "keir-finlow-bates",
    kind: PartyKind.Person,
    about:
      "Blockchain author and founder of Chainfrog who hid twelve Bitcoin keys in his own book and its Italian translation, then forgot them on purpose.",
    profiles: [
      profile("medium", "https://kf106.medium.com/"),
      profile("github", "https://github.com/kf106"),
    ],
    facts: [
      fact(
        "Hid eight private keys in Move Over Brokers, Here Comes The Blockchain and sent 0.002 BTC to each address a few days before the book came out in late 2020.",
        ARTICLE,
        { date: "2025-09-11" },
      ),
      fact(
        "Designed four more puzzles for the Italian edition, Scansatevi Broker, after the Bitcoin price had more than doubled.",
        ARTICLE,
        { date: "2025-09-11" },
      ),
      fact(
        "Wrote that he keeps no record of the twelve private keys and no notes on how the puzzles were built.",
        ARTICLE,
        { date: "2025-09-11" },
      ),
      fact("Runs Chainfrog Oy as its CEO and founder.", "https://github.com/kf106"),
    ],
  });

  /** Every lot, the English ones first, each edition from easy to very hard. */
  static readonly puzzles = [
    moveOverBrokersEnEasy1,
    moveOverBrokersEnEasy2,
    moveOverBrokersEnMedium1,
    moveOverBrokersEnMedium2,
    moveOverBrokersEnHard1,
    moveOverBrokersEnHard2,
    moveOverBrokersEnVeryHard1,
    moveOverBrokersEnVeryHard2,
    moveOverBrokersItEasy,
    moveOverBrokersItMedium,
    moveOverBrokersItHard,
    moveOverBrokersItVeryHard,
  ];

  /** Builds the canonical collection. */
  constructor() {
    super(
      MoveOverBrokersCollection.key,
      MoveOverBrokersCollection.author,
      MoveOverBrokersCollection.puzzles,
    );
  }
}

/** Canonical collection instance. */
export const moveOverBrokers = new MoveOverBrokersCollection();
