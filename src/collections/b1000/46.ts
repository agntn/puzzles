import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/46`. */
export const b1000Puzzle46 = bitcoinPuzzle({
  id: "b1000/46",
  address: p2pkh("1F3JRMWudBaj48EhwcHDdpeuy2jwACNxjP", "9a012260d01c5113df66c8a8438c9f7a1e3d5dac"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("03fd5487722d2576cb6d7081426b66a3e2986c1ce8358d479063fb5f2bb6dd5849"),
  key: hex("00000000000000000000000000000000000000000000000000002ec18388d544", 46).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgdLwb42sQhwTBJDnG",
  ),
  prize: 0.046,
  solvedAt: "2015-01-30 21:04:12",
  solveTime: 1306618,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.046,
    ),
    claim(
      "ff02b5d1efe2c95c6efadae4384eb7fb654e64b8bef2cbeb3d45774665555504",
      "2015-01-30 21:04:12",
      0.046,
    ),
  ],
});
