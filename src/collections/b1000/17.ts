import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/17`. */
export const b1000Puzzle17 = bitcoinPuzzle({
  id: "b1000/17",
  address: p2pkh("1HduPEXZRdG26SUT5Yk83mLkPyjnZuJ7Bm", "b67cb6edeabc0c8b927c9ea327628e7aa63e2d52"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("033f688bae8321b8e02b7e6c0a55c2515fb25ab97d85fda842449f7bfa04e128c3"),
  key: hex("000000000000000000000000000000000000000000000000000000000001764f", 17).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFiHkRsp99uC",
  ),
  prize: 0.017,
  solvedAt: "2015-01-15 18:07:14",
  solveTime: 0,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.017,
    ),
    claim(
      "e1818d951b51d4a0ed05f49b52e3300524bbdd03ad5d29bad15a1a09a5431e50",
      "2015-01-15 18:07:14",
      0.017,
    ),
  ],
});
