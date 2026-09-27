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

/** Where the question and the funding txid of block 28 were published. */
const THREAD =
  "https://www.reddit.com/r/bitcoinpuzzles/comments/bc3l0m/hard_7mbtc_quizchain_block_28/";

/** The author's comment of April 12, 2019 in the thread. */
const AUTHOR_COMMENT = "https://www.reddit.com/r/bitcoinpuzzles/comments/bc3l0m/comment/ekovkao/";

/**
 * Quizchain block 28: nine FUs after Brute, a space and the last three characters of the block 27
 * key, hashed with MD5 into BIP39 entropy. The author later wrote that the link was messed up and
 * should read `NM2`. The funded hash uses `MA2`, the actual tail of the block 27 key. No source
 * printed the hash or the key.
 */
export const quizchainBlock28 = bitcoinPuzzle({
  id: "quizchain/28",
  address: p2pkh("19PEtVBuiFeAAKU5uhGyZ5NwsK6xwRBFpH", "5bf5c012f2955cad02529d0d9d6343da77363511"),
  sourceUrl: THREAD,
  startedAt: "2019-04-11 18:46:38",
  status: Status.Solved,
  pubkey: compressed("032db1e52b7290ddfa97d99b9a19e3ed843cffbbb44d95cee212aefc7bc98da2ad"),
  key: wif("KwmmWhLkyVqELbEUFx4EyReV2qz6kn7j82yUoLgTu9sUGtkJszff")
    .entropy(
      "535380e31644c8f30e484e9c974a5459",
      source(
        THREAD,
        "MD5 of the solution, a space and the last three characters of the block 27 key",
      ),
    )
    .derived(),
  prize: 0.007,
  hints: [
    official("Question: What is BFU?", THREAD, undefined, {
      answer: answer("Solution was BruteFUFUFUFUFUFUFUFUFU", THREAD),
    }),
    official("Format: [solution] [link] with one space between.", THREAD),
    official(
      "Emergency update: Another screw up. Link for this needs to be NM2, not MA2.",
      AUTHOR_COMMENT,
    ),
  ],
  solvedAt: "2019-04-12 10:29:44",
  solveTime: 56_586,
  transactions: [
    funding(
      "2b91c510c78de50e9ddeb094583ab9ee2a2d8e0f477328eac2a53087effa64b9",
      "2019-04-11 18:46:38",
      0.007,
    ),
    claim(
      "9aa47a9a1bbbc4fc0167a3f4418849797a7ae3f1512c60289c8986a7a7a92d11",
      "2019-04-12 10:29:44",
      0.00679648,
    ),
  ],
});
