import {
  answer,
  claim,
  compressed,
  confirmation,
  funding,
  official,
  p2pkh,
  source,
  wif,
} from "../../core/parts.ts";
import { bitcoinPuzzle, Status } from "../../core/puzzle.ts";

/** Where the question, the funding txid, the solution and the private key of block 4 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/baejeg/medium_7_mbtc_quizchain_block_4/";

/** The Wayback capture whose HTML carries the post with its solution edit. */
const CAPTURE =
  "https://web.archive.org/web/20230611095720/https://www.reddit.com/r/bitcoinpuzzles/comments/baejeg/medium_7_mbtc_quizchain_block_4/";

/**
 * Quizchain block 4: the two words inside the Kanji for "know", written together, with the last
 * three characters of the block 3 key appended, hashed with SHA-256 into BIP39 entropy. The post
 * names the funding transaction, not the address, and the author edited the solution and the
 * private key into it. The entropy hash is not printed; it is the post's recipe run on the
 * published solution, and it derives that key.
 */
export const quizchainBlock4 = bitcoinPuzzle({
  id: "quizchain/4",
  address: p2pkh("1JUZ8dxsH67yZd9KcuqpsSPA6fENtzM3NU", "bfb03103ed7259e878deb4a72fc987f42fdce21e"),
  sourceUrl: THREAD,
  startedAt: "2019-04-07 09:15:55",
  status: Status.Solved,
  pubkey: compressed("034c27064d1789e275d76e898f5d5525bf6a5833ca959e02269db025b196cecdec"),
  key: wif("KwZXovJ7Fxu39q7TYmnwrjmBoYCcS86nga8snnsB6RDD5GXd86TX").entropy(
    "0574a857c65a79835fa888c5321facc875073f553b94d1985041fd8f995ea4fa",
    source(
      THREAD,
      "SHA-256 of the two words with the last three characters of the block 3 key appended",
    ),
  ),
  prize: 0.007,
  hints: [
    official(
      'Do you know two words? They are in the word "know".',
      THREAD,
      confirmation(CAPTURE, "Wayback capture of the post with the solution edit"),
      {
        answer: answer(
          'The Chinese symbol (Kanji) for "know" is composed of the two elements "arrow" (to the left) and "mouth" (to the right).',
          THREAD,
        ),
      },
    ),
    official(
      "As always, take the solution string (no space between the two words), append the last three digits from the private key of the third block, run a SHA 256 hash on that and then use as entropy for brain wallet.",
      THREAD,
      undefined,
      { answer: answer("arrowmouth83S", THREAD) },
    ),
    official(
      "This one is difficult, so here is one extra hint. Look at my handle name.",
      THREAD,
      undefined,
      {
        answer: answer(
          "The hint about my handlename was to point to the fact that it is a Japanese name.",
          THREAD,
        ),
      },
    ),
  ],
  solvedAt: "2019-04-07 10:45:28",
  solveTime: 5373,
  transactions: [
    funding(
      "29eb1d7fdae7d1bc7cea6824ff4d7e2acf3935ce830c434a40dfe13bdd8e01b5",
      "2019-04-07 09:15:55",
      0.007,
    ),
    claim(
      "4a571d060233ed298ee8227be1596f89523b556d8af4d9378483f62a4aa95f14",
      "2019-04-07 10:45:28",
      0.00699322,
    ),
  ],
});
