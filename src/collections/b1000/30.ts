import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/30`. */
export const b1000Puzzle30 = bitcoinPuzzle({
  id: "b1000/30",
  address: p2pkh("1LHtnpd8nU5VHEMkG2TMYYNUjjLc992bps", "d39c4704664e1deb76c9331e637564c257d68a08"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("030d282cf2ff536d2c42f105d0b8588821a915dc3f9a05bd98bb23af67a2e92a5b"),
  key: hex("000000000000000000000000000000000000000000000000000000003d94cd64", 30).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M8diLSC5MyERoW",
  ),
  prize: 0.03,
  solvedAt: "2015-01-16 13:31:58",
  solveTime: 69884,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.03,
    ),
    claim(
      "7c08f94495f5773e65c50d7a0a03e366802de9ac4063ed79316d9eba332d0e9d",
      "2015-01-16 13:31:58",
      0.03,
    ),
  ],
});
