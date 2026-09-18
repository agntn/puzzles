import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/3`. */
export const b1000Puzzle3 = bitcoinPuzzle({
  id: "b1000/3",
  address: p2pkh("19ZewH8Kk1PDbSNdJ97FP4EiCjTRaZMZQA", "5dedfbf9ea599dd4e3ca6a80b333c472fd0b3f69"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("025cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc"),
  key: hex("0000000000000000000000000000000000000000000000000000000000000007", 3).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU76rnZwVdz",
  ),
  prize: 0.003,
  solvedAt: "2015-01-15 18:07:14",
  solveTime: 0,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.003,
    ),
    claim(
      "fa1b9a669a7c16f1d0b15cfb57e9830ccee36db984bd074de450e47088c8d078",
      "2015-01-15 18:07:14",
      0.003,
    ),
  ],
});
