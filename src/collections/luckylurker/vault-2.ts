import { confirmation, funding, official, p2wpkh } from "../../core/parts.ts";
import { bitcoinPuzzle } from "../../core/puzzle.ts";

/** Vault #2 was announced in September; public hints are scheduled for October 12. */
export const luckyLurkerVault2 = bitcoinPuzzle({
  id: "luckylurker/vault_2",
  address: p2wpkh(
    "bc1qnepv9pcnqvndux9h9mcaxvk6u993rc0lew9fpp",
    "9e42c287130326de18b72ef1d332dae14b11e1ff",
  ),
  sourceUrl: "https://luckylurker.com/bitcoin-vault-2/",
  startedAt: "2026-09-11 16:42:56",
  prize: 1,
  hints: [
    official(
      "Hints will be published gradually from 12 October 2026. They will not simply reveal the seed phrase one word at a time.",
      "https://luckylurker.com/bitcoin-vault-2/",
      confirmation(
        "https://luckylurker.com/bitcoin-vault-2-is-live-1-btc-prize/",
        "The launch announcement confirms the schedule and warns that clues may need combining.",
      ),
    ),
  ],
  transactions: [
    funding(
      "2314d7f0b76c4f29ed1cfb949fd2882d648712f5c6cbaef9d7dff8ddee46f198",
      "2026-08-12 14:19:56",
      1,
    ),
  ],
});
