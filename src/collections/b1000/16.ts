import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/16`. */
export const b1000Puzzle16 = bitcoinPuzzle({
  id: "b1000/16",
  address: p2pkh("1BDyrQ6WoF8VN3g9SAS1iKZcPzFfnDVieY", "7025b4efb3ff42eb4d6d71fab6b53b4f4967e3dd"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("029d8c5d35231d75eb87fd2c5f05f65281ed9573dc41853288c62ee94eb2590b7a"),
  key: hex("000000000000000000000000000000000000000000000000000000000000c936", 16).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFbjHrFMWzJp",
  ),
  prize: 0.016,
  solvedAt: "2015-01-15 18:07:14",
  solveTime: 0,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.016,
    ),
    claim(
      "4d102a549127e6fcdc4f6b4820a2c99eeba71af9fc0d6e79f43571f192bd09c8",
      "2015-01-15 18:07:14",
      0.016,
    ),
  ],
});
