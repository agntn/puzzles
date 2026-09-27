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

/** Where the question and the funding txid of block 61 were published. */
const THREAD = "https://www.reddit.com/r/bitcoinpuzzles/comments/bgg9mx/7_mbtc_quizchain_block_61/";

/**
 * Quizchain block 61: `Love`, TOMI, `Atbash` and seven characters the post gave as the tail of the
 * block 60 key, hashed with MD5 into BIP39 entropy. They are the tail of the block 59 key, as a
 * player pointed out. The funded hash uses them as given. Claimed in the funding block. No source
 * printed the hash or the key.
 */
export const quizchainBlock61 = bitcoinPuzzle({
  id: "quizchain/61",
  address: p2pkh("17uboXEVcgijMjNZ4ZjRnhwWLot1ic3xHj", "4bc36fa02dea2fc03a0a8bdd258cb0c2b73dd10e"),
  sourceUrl: THREAD,
  startedAt: "2019-04-23 13:43:50",
  status: Status.Solved,
  pubkey: compressed("02ce632d4c86b18c58bc448a491b3432e616a415489b3ebe6494893181acf365f9"),
  key: wif("L5YFWxwM8knMBxcbAEH1yz5YYqNrRbr87syTDvNC1Zk41TcyacQf")
    .entropy(
      "13656367029a4fd1b32e12dfc657ec49",
      source(
        THREAD,
        "MD5 of the word, TOMI, the cipher and the seven characters the post gave, which end the block 59 key",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: Beautiful four letter word.", THREAD, undefined, {
      answer: answer(
        "Solution was Love, since that word can be made from two Atbash pairs, LO and EV.",
        THREAD,
      ),
    }),
    official(
      "Use kS5ehsq (last 7 digits of block 60 private key) for link. Use Atbash as TOMI string.",
      THREAD,
    ),
    official("Solution word is capital letter first letter only.", THREAD),
  ],
  solvedAt: "2019-04-23 13:43:50",
  solveTime: 0,
  transactions: [
    funding(
      "45e038c49566d07b0f730b1d1ca584a81db5006236e13bccb2b9354278c6e2c1",
      "2019-04-23 13:43:50",
      0.007,
    ),
    claim(
      "8be39de55bc56fa12a9fc626d48cb5a5e7ab5c57930c8e8eb4d1bcc49dde9d65",
      "2019-04-23 13:43:50",
      0.00680544,
    ),
  ],
});
