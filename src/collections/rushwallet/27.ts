import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";
import { claim, funding, hex, p2pkh, uncompressed } from "../../core/parts.ts";

/** Puzzle `rushwallet/27`. */
export const rushwalletPuzzle27 = bitcoinPuzzle({
  id: "rushwallet/27",
  address: p2pkh("1FvnqYfHXEBAbtoghXvubjdpkCxnYVYdWW", "a3be11dae74c0dc927dbb8627f2525bd2e2dff4a"),
  sourceUrl: "https://web.archive.org/web/20150208172337/https://rushwallet.com/contest",
  startedAt: "2014-09-22 20:48:06",
  status: Status.Solved,
  pubkey: uncompressed(
    "0474a738d294281c7489c36a18bc3c54fae1dc793cbea76a79523d415961d015afeb923c190ec40dd32abcd157d895b968acbf2e58317a042ec43697612979ec60",
  ),
  key: hex("41a45f595d71790def095a1add8d4a8a5ffa91ae54bdf867eff0e57d48513e8f")
    .wif("5JKCKXsknfUcC8AudrvaereEhocbWieoTsvzUoNXA8XFn4aD92J")
    .passphrase("babooshka babooshka babooshka babooshka babooshka"),
  solvedAt: "2014-09-23 18:16:50",
  solveTime: 77324,
  transactions: [
    funding(
      "a9cf4c676178f158ad01fdcab5923ba2b340353057c28c143934bfcdeb6dc1a1",
      "2014-09-22 20:48:06",
      0.025,
    ),
    claim(
      "774d1e10cefa5767d9fbed138af22ad25048b26b780098557c00f0a3f0e2079b",
      "2014-09-23 18:16:50",
      0.025,
    ),
  ],
});
