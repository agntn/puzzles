import {
  answer,
  claim,
  compressed,
  confirmation,
  hex,
  official,
  p2wpkh,
} from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

/** Vault #1 uses an Electrum SegWit seed, not BIP39, at m/0'/0/1. */
export const luckyLurkerVault1 = bitcoinPuzzle({
  id: "luckylurker/vault-1",
  address: p2wpkh(
    "bc1q32e3dxcd0n2tlzdmchraf2057d0ax4xdwrk3jq",
    "8ab3169b0d7cd4bf89bbc5c7d4a9f4f35fd354cd",
  ),
  sourceUrl: "https://luckylurker.com/bitcoin-vault/",
  startedAt: "2026-03-16 17:54:03",
  status: Status.Solved,
  solvedAt: "2026-08-17 18:08:09",
  key: hex("d82ce0eaffce690777d571b7943ca782a7c83f48a84269afd26148c3d5816a0a"),
  pubkey: compressed("024ad3b398bc9a95b4b8d44310e15a5355402dba3c784e60bf3b14821ca1622adb"),
  prize: 0.0008,
  hints: [
    official(
      "Word #1: Presence without permanence.",
      "https://luckylurker.com/bitcoin-vault/",
      confirmation(
        "https://github.com/floflo777/open-crypto-puzzles/blob/main/4-solved/luckylurker-seed-riddles-80ksats/data/hints.csv",
        "Independent transcription of the riddle before the answers were published.",
      ),
      {
        date: "2026-03-17 17:30:00",
        answer: answer("visit", "https://luckylurker.com/bitcoin-vault/"),
      },
    ),
    official(
      "Word #2: A realm where the crown is law.",
      "https://luckylurker.com/bitcoin-vault/",
      confirmation(
        "https://github.com/floflo777/open-crypto-puzzles/blob/main/4-solved/luckylurker-seed-riddles-80ksats/data/hints.csv",
        "Independent transcription of the riddle before the answers were published.",
      ),
      {
        date: "2026-03-18 09:00:00",
        answer: answer("kingdom", "https://luckylurker.com/bitcoin-vault/"),
      },
    ),
    official(
      "Word #3: The word is hidden inside this article (https://luckylurker.com/crypto-casinos-guide/). It’s marked visually, so you can't miss it if you look closely.",
      "https://luckylurker.com/bitcoin-vault/",
      confirmation(
        "https://github.com/floflo777/open-crypto-puzzles/blob/main/4-solved/luckylurker-seed-riddles-80ksats/data/hints.csv",
        "Independent transcription of the riddle before the answers were published.",
      ),
      {
        date: "2026-03-18 17:30:00",
        answer: answer("unveil", "https://luckylurker.com/bitcoin-vault/"),
      },
    ),
    official(
      "Word #4: Born twice, seen once.",
      "https://luckylurker.com/bitcoin-vault/",
      confirmation(
        "https://github.com/floflo777/open-crypto-puzzles/blob/main/4-solved/luckylurker-seed-riddles-80ksats/data/hints.csv",
        "Independent transcription of the riddle before the answers were published.",
      ),
      {
        date: "2026-03-19 09:00:00",
        answer: answer("kangaroo", "https://luckylurker.com/bitcoin-vault/"),
      },
    ),
    official(
      "Word #5: Find it inside the review of our #1 rated CS2 gambling site for 2026 (https://luckylurker.com/casino/gamdom/).",
      "https://luckylurker.com/bitcoin-vault/",
      confirmation(
        "https://github.com/floflo777/open-crypto-puzzles/blob/main/4-solved/luckylurker-seed-riddles-80ksats/data/hints.csv",
        "Independent transcription of the riddle before the answers were published.",
      ),
      {
        date: "2026-03-19 17:30:00",
        answer: answer("deposit", "https://luckylurker.com/bitcoin-vault/"),
      },
    ),
    official(
      "Word #6: Not created but uncovered.",
      "https://luckylurker.com/bitcoin-vault/",
      confirmation(
        "https://github.com/floflo777/open-crypto-puzzles/blob/main/4-solved/luckylurker-seed-riddles-80ksats/data/hints.csv",
        "Independent transcription of the riddle before the answers were published.",
      ),
      {
        date: "2026-03-20 09:00:00",
        answer: answer("found", "https://luckylurker.com/bitcoin-vault/"),
      },
    ),
    official(
      "Word #7: You’ll probably agree this hunt is…",
      "https://luckylurker.com/bitcoin-vault/",
      confirmation(
        "https://github.com/floflo777/open-crypto-puzzles/blob/main/4-solved/luckylurker-seed-riddles-80ksats/data/hints.csv",
        "Independent transcription of the riddle before the answers were published.",
      ),
      {
        date: "2026-03-20 17:30:00",
        answer: answer("great", "https://luckylurker.com/bitcoin-vault/"),
      },
    ),
    official(
      "Word #8: Just read N1 Casino review (https://luckylurker.com/casino/n1/). The word is already there.",
      "https://luckylurker.com/bitcoin-vault/",
      confirmation(
        "https://github.com/floflo777/open-crypto-puzzles/blob/main/4-solved/luckylurker-seed-riddles-80ksats/data/hints.csv",
        "Independent transcription of the riddle before the answers were published.",
      ),
      {
        date: "2026-03-21 09:00:00",
        answer: answer("grid", "https://luckylurker.com/bitcoin-vault/"),
      },
    ),
    official(
      "Word #9: The quickest path still needs a second thought. Find the article on the site (https://luckylurker.com/fastest-crypto-casino-withdrawals-2026/). The word is there.",
      "https://luckylurker.com/bitcoin-vault/",
      confirmation(
        "https://github.com/floflo777/open-crypto-puzzles/blob/main/4-solved/luckylurker-seed-riddles-80ksats/data/hints.csv",
        "Independent transcription of the riddle before the answers were published.",
      ),
      {
        date: "2026-03-21 15:45:00",
        answer: answer("remind", "https://luckylurker.com/bitcoin-vault/"),
      },
    ),
    official(
      "Word #10: The systematic pursuit of the unknown.",
      "https://luckylurker.com/bitcoin-vault/",
      confirmation(
        "https://github.com/floflo777/open-crypto-puzzles/blob/main/4-solved/luckylurker-seed-riddles-80ksats/data/hints.csv",
        "Independent transcription of the riddle before the answers were published.",
      ),
      {
        date: "2026-03-22 09:00:00",
        answer: answer("science", "https://luckylurker.com/bitcoin-vault/"),
      },
    ),
    official(
      "Word #11: It only works when it’s open, and it’s there to shield you.",
      "https://luckylurker.com/bitcoin-vault/",
      confirmation(
        "https://github.com/floflo777/open-crypto-puzzles/blob/main/4-solved/luckylurker-seed-riddles-80ksats/data/hints.csv",
        "Independent transcription of the riddle before the answers were published.",
      ),
      {
        date: "2026-03-22 17:30:00",
        answer: answer("umbrella", "https://luckylurker.com/bitcoin-vault/"),
      },
    ),
    official(
      "Word #12: A single mark on a map, or the act of finding it.",
      "https://luckylurker.com/bitcoin-vault/",
      confirmation(
        "https://github.com/floflo777/open-crypto-puzzles/blob/main/4-solved/luckylurker-seed-riddles-80ksats/data/hints.csv",
        "Independent transcription of the riddle before the answers were published.",
      ),
      {
        date: "2026-03-22 18:30:00",
        answer: answer("spot", "https://luckylurker.com/bitcoin-vault/"),
      },
    ),
  ],
  transactions: [
    claim(
      "75e570a5ea243c492e2804916482f046b2392b463c51be15624e6e25a84119f7",
      "2026-08-17 18:08:09",
      0.00079638,
    ),
  ],
});
