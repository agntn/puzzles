import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/43`. */
export const b1000Puzzle43 = bitcoinPuzzle({
  id: "b1000/43",
  address: p2pkh("1PiFuqGpG8yGM5v6rNHWS3TjsG6awgEGA1", "f92044c7924e5525c61207972c253c9fc9f086f7"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("02a631f9ba0f28511614904df80d7f97a4f43f02249c8909dac92276ccf0bcdaed"),
  key: hex("000000000000000000000000000000000000000000000000000006bd3b27c591", 43).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgdB23bP5LsYN8Krv7",
  ),
  prize: 0.043,
  solvedAt: "2015-01-30 18:24:18",
  solveTime: 1297024,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.043,
    ),
    claim(
      "26dbcd4f8bbd5007385fc79954ba238bc684c305d565c60146549bb5acc3f329",
      "2015-01-30 18:24:18",
      0.043,
    ),
  ],
});
