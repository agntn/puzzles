import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/9`. */
export const b1000Puzzle9 = bitcoinPuzzle({
  id: "b1000/9",
  address: p2pkh("1CQFwcjw1dwhtkVWBttNLDtqL7ivBonGPV", "7d0f6c64afb419bbd7e971e943d7404b0e0daab4"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("0243601d61c836387485e9514ab5c8924dd2cfd466af34ac95002727e1659d60f7"),
  key: hex("00000000000000000000000000000000000000000000000000000000000001d3", 9).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFUB3vfDKcxZ",
  ),
  prize: 0.009,
  solvedAt: "2015-01-15 18:07:14",
  solveTime: 0,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.009,
    ),
    claim(
      "49647889152f4f444e6007e94d59f24003e9f012687efbd7bc273c26371c3aba",
      "2015-01-15 18:07:14",
      0.009,
    ),
  ],
});
