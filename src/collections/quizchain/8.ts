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

/** Where the question, the funding txid, the answer and the key suffix of block 8 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bar0ty/very_easy_7_mbtc_quizchain_block_8/";

/**
 * Quizchain block 8: a number, with the six characters before the last three of the block 6 key
 * appended instead of the tail of block 7, hashed with SHA-256 into BIP39 entropy. The question was
 * meant to be trivial and the six characters were not, so whoever solved block 6 took this prize
 * too. The post names the funding transaction, not the address, and after the claim edited in the
 * answer and the last three characters of this key, `HwX`. Neither the hash nor the key was ever
 * printed: the record runs the post's recipe on the answer and the reconstructed block 6 key, and
 * the key it derives ends in `HwX` and matches the public key the claim revealed.
 */
export const quizchainBlock8 = bitcoinPuzzle({
  id: "quizchain/8",
  address: p2pkh("1AKjCXbC3evWDioEQNKKtGWTbQokPZT7Jv", "6643d858f51890de80b13158bf6347af830e32e8"),
  sourceUrl: THREAD,
  startedAt: "2019-04-08 07:41:07",
  status: Status.Solved,
  pubkey: compressed("03bb1014ab885aede78f390ad446993f0a6ec9c501c0e646db087b9ea94f41260b"),
  key: wif("KwwbEXjw3E9HfiCqk3RmfYNMG7KYkUmWDnxeyc1MTdmKGwcwTHwX")
    .entropy(
      "cc0444e284fef38d8d6907c93d49b162245b8fbc203bb3ffd35945d22dfd6677",
      source(
        THREAD,
        "SHA-256 of the author's answer with the six characters before the last three of the block 6 key appended",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("How many mbtc do I plan to offer as the prize for block 77?", THREAD, undefined, {
      answer: answer(
        "As will surprise exactly no one, the correct answer for this is 777. And the last three digits of the private key for block 8 are HwX.",
        THREAD,
      ),
    }),
    official(
      "In this case you don't use the last three digits of the preceding block's private key. You need the 6 digits preceding the last three digits of the private key for block 6 (the other unsolved block right now).",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-08 11:26:31",
  solveTime: 13_524,
  transactions: [
    funding(
      "4af04e6b843f56fba6073024ed973a775944291e850fc051522b37cf2384b6e2",
      "2019-04-08 07:41:07",
      0.007,
    ),
    claim(
      "13e45d82aa69f814d6fb93da0c7c705c782ddd5dce31d7876f771071bd389bbf",
      "2019-04-08 11:26:31",
      0.00666438,
    ),
  ],
});
