import {
  answer,
  claim,
  compressed,
  funding,
  hex,
  increase,
  official,
  p2pkh,
  party,
} from "../../core/parts.ts";
import { bitcoinCashPuzzle, Status } from "../../core/puzzle.ts";

/** Where the mangled key, the author's replies and the corrected key were posted. */
const THREAD = "https://bitcointalk.org/index.php?topic=5513047";

/**
 * Mini-puzzle #120: puzzle #120's own key with three hex characters swapped, posted before its
 * solver had ever published it. The prize is the Bitcoin Cash side of the #120 address, the coins
 * it still held from before the 2017 fork. The post never prints the CashAddr, it names the #120
 * address and says the BCH sits there; this is the same HASH160 in Bitcoin Cash's encoding.
 */
export const mini120 = bitcoinCashPuzzle({
  id: "mini/120",
  address: p2pkh(
    "bitcoincash:qp95dcg22sdwa34787k8p8p9d7ma56fs3c39x022wu",
    "4b46e10a541aeec6be3fac709c256fb7da69308e",
  ),
  sourceUrl: THREAD,
  startedAt: "2024-10-14 13:48:32",
  status: Status.Solved,
  pubkey: compressed("02ceb6cbbcdbdf5ef7150682150f4ce2c6f4807b349827dcdbdd1f2efa885a2630"),
  key: hex("0000000000000000000000000000000000b10f22572c497a836ea187f2e1fc23", 120),
  prize: 1.2,
  hints: [
    official(
      "Here is a priv key for puzzle #120, but I changed three characters randomly. It's easy to find correct key even if you have minimal skills. 0xB50F22572A497A836EA18AF2E1FC23",
      `${THREAD}.msg64633165#msg64633165`,
      undefined,
      {
        date: "2024-10-14",
        answer: answer(
          "0000000000000000000000000000000000b10f22572c497a836ea187f2e1fc23 puzzle 120 key",
          `${THREAD}.msg64634120#msg64634120`,
          { date: "2024-10-14" },
        ),
      },
    ),
    official(
      "It's a strange question, all addresses in original puzzles are from compressed pubkeys. BCH is the same, of course.",
      `${THREAD}.msg64633797#msg64633797`,
      undefined,
      { date: "2024-10-14" },
    ),
  ],
  solvedAt: "2024-10-14 18:33:09",
  solveTime: 17_077,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.12,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      1.08,
    ),
    claim(
      "69ba6240389136ac29d8be6513e2e1e915b2c97dd456c98a0d2f56a4d4b3254b",
      "2024-10-14 18:33:09",
      1.2,
    ),
  ],
  solver: party(undefined, {
    addresses: ["bitcoincash:qrdkjxkvqyyvdc5e909z6algczxv0gptvs2mm9ednu"],
  }),
});
