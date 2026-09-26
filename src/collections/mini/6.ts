import {
  answer,
  claim,
  compressed,
  funding,
  hex,
  official,
  p2pkh,
  party,
} from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

/** Where the public key, the masked key, the full key and the author's pointer were posted. */
const THREAD = "https://bitcointalk.org/index.php?topic=5577390";

/**
 * Mini-puzzle #6: a key printed with two gaps of ten hex characters, 80 unknown bits in all. The
 * post prints only the public key and says 0.01 BTC sits on its address; a commenter printed the
 * address, the compressed 1-address of that key. The key is the one a commenter posted after the
 * claim, and it matches the public key.
 */
export const mini6 = bitcoinPuzzle({
  id: "mini/6",
  address: p2pkh("1LsusxaEiGpTvWcXJA9ACRDKva8REjMokr", "da0b542c85494505cf55b882d1e478519148cc6b"),
  sourceUrl: THREAD,
  startedAt: "2026-03-14 17:14:11",
  status: Status.Solved,
  pubkey: compressed("03bbf1aff1b753dfa4c58835c2c135d7d2c7cea8635d483d37a8997b666cc1fa61"),
  key: hex("1ba27fb025baf482573f6f34348ee6b14e9d8a3581c0b018dbecc642fa90d587"),
  prize: 0.01,
  hints: [
    official(
      "03BBF1AFF1B753DFA4C58835C2C135D7D2C7CEA8635D483D37A8997B666CC1FA61 Hint: private key is 1BA27FB025xxxxxxxxxx6F34348EE6B14E9D8A3581C0B01xxxxxxxxxxA90D587",
      `${THREAD}.msg66508848#msg66508848`,
      undefined,
      {
        date: "2026-03-14",
        answer: answer(
          "PRIVATE KEY: 1BA27FB025BAF482573F6F34348EE6B14E9D8A3581C0B018DBECC642FA90D587",
          `${THREAD}.msg66509998#msg66509998`,
          { date: "2026-03-14" },
        ),
      },
    ),
  ],
  solvedAt: "2026-03-14 20:47:10",
  solveTime: 12_779,
  transactions: [
    funding(
      "453899f8fba9b77f98909d20cbadd4c5bc5f9e43664838c38bae713a698f8eff",
      "2026-03-14 17:09:09",
      0.01,
    ),
    claim(
      "2a3784bd317f2c08195e3262a73993d75b42f062530989ef6329039e96d2d174",
      "2026-03-14 20:47:10",
      0.01,
    ),
  ],
  solver: party(undefined, {
    addresses: ["bc1qcm87z32n5adylf5egn23k3pqcwel6pc04eypge"],
  }),
});
