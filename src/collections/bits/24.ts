import { puzzle, Status } from "../../core/puzzle.ts";
import { claim, compressed, funding, hex } from "../../core/parts.ts";

/** Puzzle `bits/24`. */
export const bits24 = puzzle({
  id: "bits/24",
  chain: "bitcoin",
  address: "1rSnXMr63jdCuegJFuidJqWxUPV7AtUf7",
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("036ea839d22847ee1dce3bfc5b11f6cf785b0682db58c35b63d1342eb221c3490c"),
  key: hex("0000000000000000000000000000000000000000000000000000000000dc2a04", 24).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rtHyNcFoApRd",
  ),
  prize: 0.024,
  solvedAt: "2015-01-15 22:15:25",
  solveTime: 14891,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.024,
    ),
    claim(
      "0eb5b5c103e68eb0931430e7786cf1b6962f9eed5a2cb5271d4dd1699b77e86f",
      "2015-01-15 22:15:25",
      0.024,
    ),
  ],
});
