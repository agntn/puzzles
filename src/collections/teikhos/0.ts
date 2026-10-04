import { artifact, funding, increase, stage, technique } from "../../core/parts.ts";
import { puzzle } from "../../core/puzzle.ts";

const address = "0xaec7e8c221c3fd24e75c996e32289235fd899ebf";
const source = `https://etherscan.io/address/${address}#code`;

/** The first TeikhosBounty, funded like the rest but with no way to pay anyone. */
export const teikhos0 = puzzle({
  id: "teikhos/0",
  chain: "ethereum",
  address,
  sourceUrl: source,
  startedAt: "2018-02-26 01:56:30",
  techniques: [technique("xor", source)],
  prize: 1.000012026,
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
    increase(
      "0xf00a06ccf1a9dd0edb62dee7aa1acb05810eb1a741e5d1d66af72c9a2fa87ba2",
      "2026-06-21 19:52:23",
      0.00001,
    ),
    increase(
      "0xa494cec16dcfae46f68ee8d756fc8a8b0f1476eb79b20b172502c0049ea7156b",
      "2026-06-22 01:21:47",
      0.000002026,
    ),
  ],
});
