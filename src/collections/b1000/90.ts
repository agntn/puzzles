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

/** Puzzle `b1000/90`. */
export const b1000Puzzle90 = bitcoinPuzzle({
  id: "b1000/90",
  address: p2pkh("1L12FHH2FHjvTviyanuiFVfmzCy46RRATU", "d06b6e206691295ec345782d7ea0686969d8674b"),
  sourceUrl: "https://bitcointalk.org/index.php?topic=5218972",
  startedAt: "2015-01-15 18:07:14",
  status: Status.Solved,
  pubkey: compressed("035c38bd9ae4b10e8a250857006f3cfd98ab15a6196d9f4dfd25bc7ecc77d788d5"),
  key: hex("000000000000000000000000000000000000000002ce00bb2136a445c71e85bf", 90).wif(
    "KwDiBf89QgGbjEhKnhXJuH7LrciVrbEiEhLWVU4Yn1RCfnX51KrT",
  ),
  prize: 0.9,
  solvedAt: "2019-07-01 18:09:22",
  solveTime: 140659328,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.09,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      0.81,
    ),
    increase(
      "7c432398c7631600af01695c9767eff109cbfae4f7ecccaff388043a474d4f1e",
      "2019-05-16 04:25:45",
      0.00001,
    ),
    pubkeyReveal(
      "17e4e323cfbc68d7f0071cad09364e8193eedf8fefbcbd8a21b4b65717a4b3d3",
      "2019-06-01 02:07:26",
      0.00001,
    ),
    claim(
      "93037990e3739041347cb63563731c0a302d856e21c2c46b7ff491a2ff1ba9fe",
      "2019-07-01 18:09:22",
      0.9,
    ),
  ],
});
