import { p2pkh, party, seed } from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

/** Scissors Secret Sharing, a 100-point CTF task rather than a Bitcoin bounty. */
export const ledgerDonjonPuzzleScissorsSecretSharing = bitcoinPuzzle({
  id: "ledger_donjon/scissors_secret_sharing",
  address: p2pkh("1EHiMwCPzcvMdeGowsowVF2X2PgLo67Qj7"),
  sourceUrl: "https://blog.cryptohack.org/bruteforcing-bitcoin-bip39-seeds-donjon-ctf-writeup",
  startedAt: "2020-10-28",
  status: Status.Solved,
  key: seed(
    "since desk thrive carbon zone prison leaf depart hobby practice ivory luggage",
    "m/44'/0'/0'/0/0",
  ),
  solver: party("joachim"),
});
