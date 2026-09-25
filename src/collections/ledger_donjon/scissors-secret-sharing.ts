import { fact, p2pkh, party, PartyKind, seed } from "../../core/parts.ts";
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
  solver: party("joachim", {
    key: "joachim",
    kind: PartyKind.Person,
    about:
      "CryptoHack writer who solved the BIP39 task of the Ledger Donjon CTF 2020 by brute forcing the word order.",
    facts: [
      fact(
        "Wrote the CryptoHack write-up of Scissors Secret Sharing: a brute force over the ordering of twelve BIP39 words.",
        "https://blog.cryptohack.org/bruteforcing-bitcoin-bip39-seeds-donjon-ctf-writeup",
        { date: "2020-11-24" },
      ),
      fact(
        "Co-wrote with esrever the CryptoHack write-up of Projective Signatures, the ECDSA side channel task worth 500 points in the same CTF.",
        "https://blog.cryptohack.org/ecdsa-side-channel-attack-projective-signatures-donjon-ctf-writeup",
        { date: "2020-11-24" },
      ),
    ],
  }),
});
