import {
  answer,
  claim,
  compressed,
  funding,
  official,
  source,
  technique,
  wif,
} from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** The block 57 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/c8lcsr/77_mbtc_quizchain2_block_57/";

/** Quizchain2 block 57: the mobile URL of Hal Finney's tweet about Bitcoin's CO2 emissions, a 77 mBTC block. */
export const quizchain2Block57 = puzzle({
  id: "quizchain2/57",
  chain: "bitcoin",
  address: "128cmgWEf3Cbor5ftazjtisNAfaiRhDgyk",
  sourceUrl: THREAD,
  startedAt: "2019-07-03 04:38:32",
  status: Status.Solved,
  pubkey: compressed("03893c868728802733060ed67e18b584887cf89c4b59bdd3d1012fa6410461a839"),
  key: wif("L5fbSSbofJhFg5XzETrszGheM53RyQaM2am8ckJMxAuWzSHNqQN7")
    .entropy("d265daa81817aeae347023e625875961", source(THREAD, "MD5 of the URL"))
    .derived(),
  techniques: [technique("md5-to-bip39-entropy", THREAD)],
  prize: 0.077,
  hints: [
    official("Question: Thinking", THREAD, undefined, {
      answer: answer(
        'The solution was the URL to Satoshi\'s third tweet on Bitcoin (the first one was the more famous "running Bitcoin" one).',
        THREAD,
      ),
    }),
    official("Format: [solution]", THREAD, undefined, {
      answer: answer("https://mobile.twitter.com/halfin/status/1153096538", THREAD),
    }),
    official("First three digits of MD5 hash are d26.", THREAD),
  ],
  solvedAt: "2019-07-03 14:42:19",
  solveTime: 36_227,
  transactions: [
    funding(
      "5d2ba35d75f5f87276141aa73eb71b5790e33d0d602d2e03fd166ee3e64f958a",
      "2019-07-03 04:38:32",
      0.077,
    ),
    claim(
      "3454a6a4c4ce98d33b6abc781639b9a1b6a3d00c96624f92143f42c5786b35b1",
      "2019-07-03 14:42:19",
      0.07674848,
    ),
  ],
});
