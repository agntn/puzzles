import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/35`. */
export const b1000Puzzle35 = bitcoinPuzzle({
  id: "b1000/35",
  address: p2pkh("1PWCx5fovoEaoBowAvF5k91m2Xat9bMgwb", "f6d8ce225ffbdecec170f8298c3fc28ae686df25"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("02f6a8148a62320e149cb15c544fe8a25ab483a0095d2280d03b8a00a7feada13d"),
  key: hex("00000000000000000000000000000000000000000000000000000004aed21170", 35).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9MP7J9oTbu6KuRr",
  ),
  prize: 0.035,
  solvedAt: "2015-01-17 07:33:27",
  solveTime: 134773,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.035,
    ),
    claim(
      "9308722efdd45b5e4f6efbad73c9b0e5172bbc4db877a54d47b99caa31f08ab0",
      "2015-01-17 07:33:27",
      0.035,
    ),
  ],
});
