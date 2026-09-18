import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/1`. */
export const rushwalletPuzzle1 = bitcoinPuzzle({
  id: "rushwallet/1",
  address: p2pkh("1NKUXbr2URfQyzREPUzoj4MR4ytF5mEm8u", "e9d91b8f3f402170262431718fbb0ba9611e10a0"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:17:14",
  status: Status.Solved,
  pubkey: uncompressed(
    "040f5492295b3374ac3d746beb5b1e3629f19e4b7caa228e7d02a1862430e237a7c406b11d339dea846001feb79410a4bd61212f2022538c13cb24b5ad0cb44d52",
  ),
  key: hex("af9a17713338d255ca023b7014c2c9dfcbef656d61a3370156bb804269b74a0d")
    .wif("5K9d6a9ivmDKRe77hnzrSrg2iGkwFuvg1cCGDGBpsgyk6is9U7g")
    .passphrase("5784623964023 578462396402"),
  solvedAt: "2018-01-10 19:55:58",
  solveTime: 104197124,
  transactions: [
    funding(
      "202f1b15595f3821578fe73bc65a9ce4bcc46011e9481d60a518d471b453a995",
      "2014-09-22 20:17:14",
      0.025,
    ),
    claim(
      "a904300bbadf6fde7ee6ef273aaa6536899aee5f6f1f27aefa1c56962bd4da14",
      "2018-01-10 19:55:58",
      0.025,
    ),
  ],
});
