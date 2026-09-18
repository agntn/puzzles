import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex, p2pkh } from "../../core/parts.ts";

/** Puzzle `b1000/39`. */
export const b1000Puzzle39 = bitcoinPuzzle({
  id: "b1000/39",
  address: p2pkh("122AJhKLEfkFBaGAd84pLp1kfE7xK3GdT8", "0b304f2a79a027270276533fe1ed4eff30910876"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("022d77cd1467019a6bf28f7375d0949ce30e6b5815c2758b98a74c2700bc006543"),
  key: hex("0000000000000000000000000000000000000000000000000000004b5f8303e9", 39).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9RMTSCcQzX3EjMZ",
  ),
  prize: 0.039,
  solvedAt: "2015-01-21 06:35:26",
  solveTime: 476892,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.039,
    ),
    claim(
      "41abfd3419ec99b62c571c05a8183214c1ee21bc35acd0a2f24c4097c62b291f",
      "2015-01-21 06:35:26",
      0.039,
    ),
  ],
});
