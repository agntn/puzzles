import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import {
  claim,
  compressed,
  funding,
  hex,
  increase,
  p2pkh,
  pubkeyReveal,
} from "../../core/parts.ts";

/** Puzzle `b1000/2`. */
export const b1000Puzzle2 = bitcoinPuzzle({
  id: "b1000/2",
  address: p2pkh("1CUNEBjYrCn2y1SdiUMohaKUi4wpP326Lb", "7dd65592d0ab2fe0d0257d571abf032cd9db93dc"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2014-07-29 21:53:54",
  status: Status.Solved,
  pubkey: compressed("02f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9"),
  key: hex("0000000000000000000000000000000000000000000000000000000000000003", 2).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU74sHUHy8S",
  ),
  prize: 0.002,
  solvedAt: "2015-01-15 18:07:14",
  solveTime: 14674400,
  preGenesis: true,
  transactions: [
    funding(
      "9294c9d71d9da40bc4344b5755e7652789df3bc1a9f660e040725216361d1c54",
      "2014-07-29 21:53:54",
      0.0001,
    ),
    pubkeyReveal(
      "30ab16d9eb2777caa6d4734d620d618fc797f62b3f7a167b97b0edc0e0cf8973",
      "2014-07-29 21:53:54",
      0.0001,
    ),
    increase(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.002,
    ),
    claim(
      "4feb64593f6bd3ebc05906db6aeb7f6c9beb65a970d97b48c64fb4653774d79e",
      "2015-01-15 18:07:14",
      0.002,
    ),
  ],
});
