import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/31`. */
export const b1000Puzzle31 = bitcoinPuzzle({
  id: "b1000/31",
  address: p2pkh("1LhE6sCTuGae42Axu1L1ZB7L96yi9irEBE", "d805f6f251f7479ebd853b3d0f4b9b2656d92f1d"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("0387dc70db1806cd9a9a76637412ec11dd998be666584849b3185f7f9313c8fd28"),
  key: hex("000000000000000000000000000000000000000000000000000000007d4fe747", 31).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M9SmFMSCA4jQRW",
  ),
  prize: 0.031,
  solvedAt: "2015-01-16 08:02:15",
  solveTime: 50101,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.031,
    ),
    claim(
      "d482463d265ca83307f80ebcc2c3cb47b5b0e2347d08674ba0b7c2c6876155af",
      "2015-01-16 08:02:15",
      0.031,
    ),
  ],
});
