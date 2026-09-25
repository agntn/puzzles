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

/** Where the question, the funding txid, the answer and the author's account of the broken hash were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/baswxz/easy_7_mbtc_quizchain_block_9/";

/**
 * Quizchain block 9: a six word answer with the last three characters of the block 8 key appended,
 * hashed with SHA-256 into BIP39 entropy. The author copied the answer out of a word processor
 * with a line break after it, so the funded key hashes the answer plus a newline, and says so in
 * the post's second update. The post names the funding transaction, not the address, and prints
 * neither the hash nor the key: the record runs the recipe on the published answer with that line
 * break, and the key it derives matches the public key the claim revealed.
 */
export const quizchainBlock9 = bitcoinPuzzle({
  id: "quizchain/9",
  address: p2pkh("19N9hWUEFt5PKsKrciP88QXFaDNKXrMdZd", "5bc100a66ab64d78bfde8877f29f56ae0a959ae7"),
  sourceUrl: THREAD,
  startedAt: "2019-04-08 12:01:33",
  status: Status.Solved,
  pubkey: compressed("039538dcf5d80dc3ca7685f0bffd982f2ed3856815b6ceccb72147943415c03475"),
  key: wif("L16fAy6yCKjR7wQCGkqD4Lb4iWuA3EXKjT7zhA6zsw6mUeXSPfnw")
    .entropy(
      "695491c85ba501f2773fbfddafab5085a609d8f832d991d125b8bbbdd745f497",
      source(
        THREAD,
        "SHA-256 of the author's answer with the last three characters of the block 8 key appended and the line break the author says was copied with it",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official(
      "I am an evil AI robot ruling the world. I have captured a human (you) and give you a choice. You have to reply with one sentence of six words. If that sentence is a lie, I will torture you to death. If in contrast you say the truth, I will kill you in a swift and merciful way. As a robot, I am completely unable to break one of those promises. What is your answer?",
      THREAD,
      undefined,
      {
        answer: answer(
          'The correct answer was "You will torture me to death.HwX". Unfortunately, I messed up this time. I drafted this puzzle in a word processor. When copypasting it to the hash app, I did not notice that I copypasted a line break with the right answer, leading to a completely different hash and a broken link in the chain.',
          THREAD,
        ),
      },
    ),
    official(
      "Answer in the format of a six word sentence like this one: This is a six word sentence.HwX",
      THREAD,
    ),
    official(
      "HwX are the last three digits of the private key from block 8, which no one has solved yet.",
      THREAD,
    ),
  ],
  solvedAt: "2019-04-08 23:19:31",
  solveTime: 40_678,
  transactions: [
    funding(
      "d192ffe7d819135b6b99e1d9099538465cac9b65aa2a93daf9f7eb78a98be5d6",
      "2019-04-08 12:01:33",
      0.007,
    ),
    claim(
      "860248486b67fb52dc34fab4b433ac73833fc5ce695435f2a36be4297d57729d",
      "2019-04-08 23:19:31",
      0.00669472,
    ),
  ],
});
