import {
  answer,
  artifact,
  claim,
  fact,
  funding,
  party,
  PartyKind,
  stage,
  standard,
} from "../../core/parts.ts";
import { ethereumPuzzle, Status } from "../../core/puzzle.ts";

const address = "0x735ba26f91e1275fa4b504649b19ef74739fe7e7";
const source = `https://etherscan.io/address/${address}#code`;
const writeup =
  "https://github.com/floflo777/open-crypto-puzzles/tree/main/2-mid-prizes/teikhos-bipedaljoe-solver-bounties-2eth";

/** The revision of teikhos/3, solved in 2026 with a key a failed 2022 attempt left in calldata. */
export const teikhos4 = ethereumPuzzle({
  id: "teikhos/4",
  address: standard(address),
  sourceUrl: source,
  startedAt: "2018-03-14 03:11:51",
  status: Status.Solved,
  prize: 0.5,
  stages: [
    stage(
      "commit, authenticate, reward",
      "Deployed two hours after teikhos/3 as a revision with its own stored proof. authenticate() now reveals the caller's commit in the same call and reverts unless it holds, and reward() has no way back to the author: commit, authenticate, wait seven days, call reward().",
      [artifact("verified contract source", source)],
      answer(
        "ca6a98ceec61e213d9a0a8fdc0a6d5d9ed7566f5f4cfd24871fb9316feb6e1eb2367489f54a0cd4111f4c5356eb744d299a7521296786223c70947c8c36940c6",
        writeup,
        { date: "2026-08-16" },
      ),
    ),
  ],
  solvedAt: "2026-06-21 09:51:23",
  solveTime: 261038372,
  transactions: [
    funding(
      "0x9d2172e87c445fa160c46db96bd326b4bcecce2b1574659074e094811893b4d5",
      "2018-03-14 03:11:51",
      0.5,
    ),
    claim(
      "0x4d2bfceb311bda8d265debab1c8ad23cb860922b876eca523327d0405ab97bff",
      "2026-06-21 09:51:23",
      0.5,
    ),
  ],
  solver: party("floflo777", {
    key: "floflo777",
    kind: PartyKind.Person,
    addresses: ["0x83e4b2a5a464bdfcd83057ac08447f533a595156"],
    facts: [
      fact(
        "Solved a TeikhosBounty contract deployed in 2018, which pays 0.5 ETH to whoever submits the right public key.",
        "https://x.com/0xFlorent_/status/2068735759889145906",
        { date: "2026-06-21" },
      ),
      fact(
        "Found the key in the calldata of a reverted authenticate() call another address sent on 2022-04-03, then committed and authenticated through Flashbots so nobody could copy the commit.",
        writeup,
        { date: "2026-08-16" },
      ),
    ],
  }),
});
