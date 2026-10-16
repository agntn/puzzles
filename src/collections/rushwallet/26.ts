import { puzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/26`. */
export const rushwalletPuzzle26 = puzzle({
  id: "rushwallet/26",
  chain: "bitcoin",
  address: "17FTRDmSymwBvwiBAx3ds4iVHaCbUCNpKS",
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:48:06",
  status: Status.Solved,
  pubkey: uncompressed(
    "04a0746f2492fddfbd35285b3cb6f15af41fc787596d7e5a42f98e8b11d7648e8879bed40267dda13e5dcbbf2447c99036a0efca56c89c96707aefa07ce392b384",
  ),
  key: hex("4e382123f2b36a924af225f9cadcbe9d2e51253646f963e403925a8da15cdd8d")
    .wif("5JQjb2KEnQB3ry9g6grGEt375ZyYS9QGX86DUykG5mrRNBwGsDb")
    .passphrase("RushWallet by Kryptokit Fundraiser"),
  solvedAt: "2014-09-25 06:53:06",
  solveTime: 209100,
  transactions: [
    funding(
      "21163ad50a28d77165ddf4b528dd32a6902a56ab326e6744df0f71e691836d17",
      "2014-09-22 20:48:06",
      0.025,
    ),
    claim(
      "d8d2825459f70a17f9807a5c4b7088b248228316101cb097044e7fafb5ac5c99",
      "2014-09-25 06:53:06",
      0.025,
    ),
  ],
});
