import { artifact, funding, increase, stage, technique } from "../../core/parts.ts";
import { puzzle } from "../../core/puzzle.ts";

const address = "0x17e5e0910b9185b0ede564dcbf074ca910ad56a4";
const source = `https://etherscan.io/address/${address}#code`;

/** The first TeikhosBounty that pays: the public key XORed straight into a signature. */
export const teikhos1 = puzzle({
  id: "teikhos/1",
  chain: "ethereum",
  address,
  sourceUrl: source,
  startedAt: "2018-02-26 02:44:42",
  techniques: [technique("xor", source)],
  prize: 1.000002026,
  stages: [
    stage(
      "authenticate",
      "Two 32-byte words sit in storage. XOR them with the two halves of the right 64-byte public key and you get the r and s of a signature that key made over itself. authenticate() checks it with ecrecover and self-destructs to whoever sent it.",
      [artifact("verified contract source", source)],
    ),
  ],
  transactions: [
    funding(
      "0xa3af4cd51c4f499efa321cc192332533a402522e20be2f5ed000465dd3f5b55d",
      "2018-02-26 02:44:42",
      1,
    ),
    increase(
      "0x566d229f6890ddef16e04160b83318cf149af5f98a5ed3e8830af78283a9b241",
      "2026-06-22 00:19:47",
      0.000002026,
    ),
  ],
});
