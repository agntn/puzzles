import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/25`. */
export const rushwalletPuzzle25 = bitcoinPuzzle({
  id: "rushwallet/25",
  address: p2pkh("1MZcKzhoptp5ZCqNneRfZeEgstvjHGa8xR", "e18d50fd2c48599eebb1430017a30da131b8bf9c"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:48:06",
  status: Status.Solved,
  pubkey: uncompressed(
    "04ab7a4be6048064e7395d0d2b669f9c981d2d72a8ecd15b324f9c06b94c3ae5ce03a4665473b027f617015e46aa5180bf805f5f48bf658a9cefcf0cd08a73363b",
  ),
  key: hex("9fb12e3a0dd90c7256667aa4bb1505b980502da3bad129bf9e10e74fae24221e")
    .wif("5K2chgMds89aLfpAVSeQgGrfMhtzmXMpSb6uCfGr7myx8fXNXop")
    .passphrase("kryptokit.com/fundraiser"),
  solvedAt: "2014-09-23 13:16:42",
  solveTime: 59316,
  transactions: [
    funding(
      "4d7d7fe525d215c4d5c474ac13dcb739ac2a552443e8ba887215b75b4ac1b94a",
      "2014-09-22 20:48:06",
      0.025,
    ),
    claim(
      "189cfb8f7328d59ebb2eea4dc49817e9dd5365a1ae9594c10bb5d1732c0abeb8",
      "2014-09-23 13:16:42",
      0.025,
    ),
  ],
});
