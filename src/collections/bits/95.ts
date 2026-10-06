import { puzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, increase, pubkeyReveal } from "../../core/parts.ts";

/** Puzzle `bits/95`. */
export const bits95 = puzzle({
  id: "bits/95",
  chain: "bitcoin",
  address: "19eVSDuizydXxhohGh8Ki9WY9KsHdSwoQC",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("02967a5905d6f3b420959a02789f96ab4c3223a2c4d2762f817b7895c5bc88a045"),
  key: hex("0000000000000000000000000000000000000000527a792b183c7f64a0e8b1f4", 95).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVsLfMYB8ydZ3QXMqEra1sapfT",
  ),
  prize: 0.95,
  solvedAt: "2019-07-06 06:53:41",
  solveTime: 141050787,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.095,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.855,
    ),
    increase(
      "7c432398c7631600af01695c9767eff109cbfae4f7ecccaff388043a474d4f1e",
      "2019-05-16 04:25:45",
      0.00001,
    ),
    pubkeyReveal(
      "17e4e323cfbc68d7f0071cad09364e8193eedf8fefbcbd8a21b4b65717a4b3d3",
      "2019-06-01 02:07:26",
      0.00001,
    ),
    claim(
      "2b46d8d754b712c0c481185f07fa7b11100fe48f807069fc2e0779735d81c99e",
      "2019-07-06 06:53:41",
      0.95,
    ),
  ],
});
