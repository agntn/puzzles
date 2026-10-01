import {
  answer,
  claim,
  compressed,
  funding,
  official,
  p2pkh,
  source,
  wif,
} from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

/** The block 20 thread, with the question, the funding txid, the hash digits and the solution. */
const THREAD = "https://www.reddit.com/r/Grycoin/comments/btveri/7_mbtc_quizchain2_block_20/";

/** u/Randomiser's comment with the solution. */
const PLAYER_COMMENT = "https://www.reddit.com/r/Grycoin/comments/btveri/comment/ep33zng/";

/** Quizchain2 block 20: `burn address`, for a vanity address that fails its checksum. */
export const quizchain2Block20 = bitcoinPuzzle({
  id: "quizchain2/20",
  address: p2pkh("1FKbrfG7xgfYKVx9U9o3H9CViXsWrbZsFt", "9d165843464fa1da840d9a287f2a59a35093c8ad"),
  sourceUrl: THREAD,
  startedAt: "2019-05-28 01:17:18",
  status: Status.Solved,
  pubkey: compressed("0347a62e632fc1a03af4e11506def7b3ab5ee70ba41c36f2863c1ba9d2fc8cf392"),
  key: wif("Kz3J4BtaGup2TZTxH9h8y5wWCUmxL5KGsx6R9P8DY3z1NSuhWaWe")
    .entropy("497f112e67d5e049ee7f9a6d2fe6acf8", source(THREAD, "MD5 of the two words"))
    .derived(),
  prize: 0.007,
  hints: [
    official("Question : 1AndrewYangForPresident2o2o6zmPzd", THREAD, undefined, {
      answer: answer('Solution was just "burn address".', THREAD),
    }),
    official("Format: [solution]", THREAD, undefined, {
      answer: answer('The solution is simply "burn address".', PLAYER_COMMENT),
    }),
    official("First three digits of MD5 hash are 497.", THREAD),
  ],
  solvedAt: "2019-05-28 04:10:09",
  solveTime: 10_371,
  transactions: [
    funding(
      "4e96917f57f6d2736054dfe7db0d082ee13cbe6164f3279b74286765a6ec2809",
      "2019-05-28 01:17:18",
      0.007,
    ),
    claim(
      "20379ff2571b0741b0a81a78de1454ae8f4e203191b409b4f559a22f4acbd7ad",
      "2019-05-28 04:10:09",
      0.00659066,
    ),
  ],
});
