import { answer, claim, compressed, funding, official, source, wif } from "../../core/parts.ts";
import { puzzle, Status } from "../../core/puzzle.ts";

/** Where the question and the funding txid of block 15 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bb7q8r/easy_7_mbtc_quizchain_block_15/";

/**
 * Quizchain block 15: a sentence from the whitepaper with every a, o and i removed, a space and the
 * last three characters of the block 14 key, hashed into BIP39 entropy. The post asked for SHA-256.
 * The author's hashing app had reset to MD5, and the emergency update says so. Every block after
 * this one is MD5. No source printed the hash or the key.
 */
export const quizchainBlock15 = puzzle({
  id: "quizchain/15",
  chain: "bitcoin",
  address: "112Gm9cAaaLSPLBcRDaCyoyrUwAGwiM3mZ",
  sourceUrl: THREAD,
  startedAt: "2019-04-09 13:03:51",
  status: Status.Solved,
  pubkey: compressed("02e75292ab0b96d719b0c6bbf13da054196d6fcdee64df0c075528a7292bfcfd6c"),
  key: wif("KwszAWYYFHvEsfayfwP2YvvSFJ9gd6UFKJ5FjritPRJkXRbNQzF3")
    .entropy(
      "d552ee8c492129a28e5d7d18831554fb",
      source(
        THREAD,
        "MD5 of the sentence without its a, o and i, a space and the last three characters of the block 14 key",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official(
      "The longest chain not only serves as proof of the sequence of the events witnessed",
      THREAD,
      undefined,
      {
        answer: answer(
          "The lngest chn nt nly serves s prf f the sequence f the events wtnessed ZNb",
          THREAD,
        ),
      },
    ),
    official(
      "Remove certain letters from that sentence for the solution, then append the last three digits of the private key of the previous block, with a space between the solution and the linking three digits.",
      THREAD,
    ),
    official(
      "Emergency update: I found another way to screw this up. Delivery on this one works only if you do the hash with MD5 algorithm. I restarted the hashing app and did not notice that it reset to MD5...",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-10 01:34:41",
  solveTime: 45_050,
  transactions: [
    funding(
      "28c827328eda7da662349f363deb359c35425227c664d63fd39d90e447200342",
      "2019-04-09 13:03:51",
      0.007,
    ),
    claim(
      "98dec91af8291a0cea1515e5a4f40f9acdb592fb4aba4a7ec6aa57506c6fb25e",
      "2019-04-10 01:34:41",
      0.00669472,
    ),
  ],
});
