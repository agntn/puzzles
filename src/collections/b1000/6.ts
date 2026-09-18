import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/6`. */
export const b1000Puzzle6 = bitcoinPuzzle({
  id: "b1000/6",
  address: p2pkh("1PitScNLyp2HCygzadCh7FveTnfmpPbfp8", "f93ec34e9e34a8f8ff7d600cdad83047b1bcb45c"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("03f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530"),
  key: hex("0000000000000000000000000000000000000000000000000000000000000031", 6).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU7Tmu6qHxS",
  ),
  prize: 0.006,
  solvedAt: "2015-01-15 18:07:14",
  solveTime: 0,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.006,
    ),
    claim(
      "aa75e831a27d71dae09a5feeb7fec041ba0a55d1e9c3ac1d32ce88852dcedaa3",
      "2015-01-15 18:07:14",
      0.006,
    ),
  ],
});
