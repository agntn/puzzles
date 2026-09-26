import { artifact, funding, increase, stage, standard } from "../../core/parts.ts";
import { ethereumPuzzle } from "../../core/puzzle.ts";

const address = "0xaec7e8c221c3fd24e75c996e32289235fd899ebf";
const source = `https://etherscan.io/address/${address}#code`;

/** The first TeikhosBounty, funded like the rest but with no way to pay anyone. */
export const teikhos0 = ethereumPuzzle({
  id: "teikhos/0",
  address: standard(address),
  sourceUrl: source,
  startedAt: "2018-02-26 01:56:30",
  prize: 1,
  stages: [
    stage(
      "authenticate",
      "The simple mask of teikhos/1, but on the right key authenticate() only returns true. Nothing in the code sends ETH anywhere, so the balance stays put whoever finds the key.",
      [artifact("verified contract source", source)],
    ),
  ],
  transactions: [
    funding(
      "0x9018ea28aa73fd35781d30a8b06b0a3efaf43e1837941cb6cfbcee1b4b896da1",
      "2018-02-26 01:56:30",
      0.1,
    ),
    increase(
      "0x5e3c25d7005d41f4d6d5e8e44d82d12d7ef7782391b4b5a911440240ae9bf956",
      "2018-02-26 01:57:42",
      0.9,
    ),
  ],
});
