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

/** Where the twelve pieces, the rebuilt key and the author's wrap-up were posted. */
const THREAD = "https://bitcointalk.org/index.php?topic=5518896";

/**
 * Mini-puzzle #2, for puzzle #125: that puzzle's key cut into twelve hex pieces in no particular
 * order. The prize is the Bitcoin Cash side of the #125 address; the post names the puzzle, not the
 * CashAddr, which is the same HASH160 in Bitcoin Cash's encoding.
 */
export const mini2 = bitcoinCashPuzzle({
  id: "mini/2",
  address: p2pkh(
    "bitcoincash:qrms0yjk4gp8m3phew6nn724gujpvujleq9gkhh8fz",
    "f7079256aa027dc437cbb539f955472416725fc8",
  ),
  sourceUrl: THREAD,
  startedAt: "2024-11-14 13:45:25",
  status: Status.Solved,
  pubkey: compressed("0233709eb11e0d4439a729f21c2c443dedb727528229713f0065721ba8fa46f00e"),
  key: hex("000000000000000000000000000000001c533b6bb7f0804e09960225e44877ac", 125).wif(
    "KwDiBf89QgGbjEhKnhXJuH7Nbdz1FhKePEPcr4to6PqoSc6KxQy6",
  ),
  prize: 1.25,
  hints: [
    official(
      "The key fell and shattered into 12 pieces: 804 E09 77 1C5 225 AC 960 33B 7F0 E4 6BB 48. The order of the pieces is unknown, assemble the key back together!",
      `${THREAD}.msg64739119#msg64739119`,
      undefined,
      {
        date: "2024-11-14",
        answer: answer(
          "0x1c533b6bb7f0804e09960225e44877ac KwDiBf89QgGbjEhKnhXJuH7Nbdz1FhKePEPcr4to6PqoSc6KxQy6",
          `${THREAD}.msg64741259#msg64741259`,
          { date: "2024-11-14" },
        ),
      },
    ),
  ],
  solvedAt: "2024-11-14 15:42:33",
  solveTime: 7028,
  transactions: [
    funding(
      "08389f34c98c606322740c0be6a7125d9860bb8d5cb182c02f98461e5fa6cd15",
      "2015-01-15 18:07:14",
      0.125,
    ),
    increase(
      "5d45587cfd1d5b0fb826805541da7d94c61fe432259e68ee26f4a04544384164",
      "2017-07-11 05:00:53",
      1.125,
    ),
    claim(
      "a8f6cf8dead86c89bbc13e00caa402e9929a9356b498d45039b5c02c5844823f",
      "2024-11-14 15:42:33",
      1.25,
    ),
  ],
  solver: party(undefined, {
    addresses: ["bitcoincash:qpfumxdtepezyg85tax52uq39ugzqan03glqrdjalm"],
  }),
});
