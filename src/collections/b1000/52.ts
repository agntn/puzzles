import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/52`. */
export const b1000Puzzle52 = bitcoinPuzzle({
  id: "b1000/52",
  address: p2pkh("15z9c9sVpu6fwNiK7dMAFgMYSK4GqsGZim", "36af659edbe94453f6344e920d143f1778653ae7"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("0374c33bd548ef02667d61341892134fcf216640bc2201ae61928cd0874f6314a7"),
  key: hex("000000000000000000000000000000000000000000000000000efae164cb9e3c", 52).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjguYJTZsntce5oQQrh",
  ),
  prize: 0.052,
  solvedAt: "2017-04-21 18:10:05",
  solveTime: 71452971,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.052,
    ),
    claim(
      "b0df330141225a2253c375b7b6c36c0016a9633934295916df6b0fd31afb4a8b",
      "2017-04-21 18:10:05",
      0.052,
    ),
  ],
});
