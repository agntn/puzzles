import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, increase, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/54`. */
export const b1000Puzzle54 = bitcoinPuzzle({
  id: "b1000/54",
  address: p2pkh("1KYUv7nSvXx4642TKeuC2SNdTk326uUpFy", "cb66763cf7fde659869ae7f06884d9a0f879a092"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("034af4b81f8c450c2c870ce1df184aff1297e5fcd54944d98d81e1a545ffb22596"),
  key: hex("00000000000000000000000000000000000000000000000000236fb6d5ad1f43", 54).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjhHvuTMSDchRp5hktc",
  ),
  prize: 0.54,
  solvedAt: "2017-11-16 11:04:22",
  solveTime: 89485028,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.054,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.486,
    ),
    claim(
      "02e9c6ccae985a6485e633b56a084dae2a32736e5b866c3b9622db9d3c57078f",
      "2017-11-16 11:04:22",
      0.54,
    ),
  ],
});
