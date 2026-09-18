import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/11`. */
export const rushwalletPuzzle11 = bitcoinPuzzle({
  id: "rushwallet/11",
  address: p2pkh("17wDTyKr6pEn6mXUku9vh89JucE1L3SMjb", "4c119f35b75fe1598c02e81b4b6b431a54b606ae"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:17:14",
  status: Status.Solved,
  pubkey: uncompressed(
    "04ee8021595c123587ca98d7682a5f175bfda0326133b572db455756910a0b277a4b19feee6c4d84834d319c3cd72a6c5059f9620dbad21f62b630d774403cde89",
  ),
  key: hex("0f8489b2c250110704e4877b9ac033156ac325908ceee2a8857b14d80207789b")
    .wif("5Hw7xh3T7TVewfSWfmLFJTEki9NSvFbnqVxXg8HMCpLPC3JjNXL")
    .passphrase("www.kryptokit.com"),
  solvedAt: "2014-09-23 16:40:13",
  solveTime: 73379,
  transactions: [
    funding(
      "991cdeea72a797cffce875f761d82e50e16bfc000cc52f35578a6d9e76d31397",
      "2014-09-22 20:17:14",
      0.025,
    ),
    claim(
      "6bdff5bd447cd9e33e135e2f4293ef17e55e5884fcb2d9ed20ab5246a6341760",
      "2014-09-23 16:40:13",
      0.0008,
    ),
  ],
});
